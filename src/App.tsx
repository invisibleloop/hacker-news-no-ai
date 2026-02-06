import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FeedType } from './utils/api';
import { useStories } from './hooks/useStories';
import { Header } from './components/Header';
import { StoryList } from './components/StoryList';
import { Footer } from './components/Footer';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Determine current feed from URL
  const getCurrentFeed = (): FeedType => {
    const path = location.pathname.slice(1) || 'top';
    if (path === 'top' || path === 'new' || path === 'best' || path === 'show') {
      return path;
    }
    return 'top';
  };

  const currentFeed = getCurrentFeed();

  // Handle feed changes by navigating to new URL
  const handleFeedChange = (feed: FeedType) => {
    navigate(`/${feed}`);
  };

  const { stories, loading, error, filterStats, hasMore, loadMore } = useStories(currentFeed);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const isInitialLoad = stories.length === 0 && loading;

  return (
    <div className="min-h-screen bg-hn-beige dark:bg-gray-900 transition-colors flex flex-col">
      <Header
        currentFeed={currentFeed}
        onFeedChange={handleFeedChange}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        filterStats={filterStats}
      />
      <main className="max-w-4xl mx-auto px-4 py-6 flex-1">
        <StoryList
          stories={stories}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isInitialLoad={isInitialLoad}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
