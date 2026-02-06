import { FeedType } from '../utils/api';

interface HeaderProps {
  currentFeed: FeedType;
  onFeedChange: (feed: FeedType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  filterStats: { total: number; aiFiltered: number };
}

export function Header({
  currentFeed,
  onFeedChange,
  darkMode,
  onToggleDarkMode,
  filterStats,
}: HeaderProps) {
  const feeds: FeedType[] = ['top', 'new', 'best', 'show'];

  return (
    <header className="bg-hn-orange dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-white font-bold text-2xl tracking-tight">HN Sans AI</h1>
            <nav className="flex gap-2">
              {feeds.map(feed => (
                <button
                  key={feed}
                  onClick={() => onFeedChange(feed)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    currentFeed === feed
                      ? 'bg-white text-hn-orange shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-white hover:bg-white/20 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {feed.charAt(0).toUpperCase() + feed.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="text-white hover:bg-white/20 dark:hover:bg-gray-700/50 px-3 py-2 rounded-md text-xl transition-all hover:scale-110 active:scale-95"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        {filterStats.total > 0 && (
          <div className="text-white/90 text-sm mt-3 font-medium">
            Showing {filterStats.total - filterStats.aiFiltered} of{' '}
            {filterStats.total} stories ({filterStats.aiFiltered} AI posts
            hidden)
          </div>
        )}
      </div>
    </header>
  );
}
