import { HNStory } from '../utils/api';
import { StoryCard } from './StoryCard';
import { LoadingSpinner } from './LoadingSpinner';

interface StoryListProps {
  stories: HNStory[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  isInitialLoad: boolean;
}

export function StoryList({
  stories,
  loading,
  error,
  hasMore,
  onLoadMore,
  isInitialLoad,
}: StoryListProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-hn-orange text-white rounded-lg hover:bg-orange-600 transition-all hover:shadow-lg font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isInitialLoad && loading) {
    return <LoadingSpinner />;
  }

  if (stories.length === 0 && !loading) {
    return (
      <div className="text-center py-12 text-hn-gray dark:text-gray-400 text-lg">
        No stories found.
      </div>
    );
  }

  return (
    <div>
      {loading && !isInitialLoad ? (
        <LoadingSpinner message="Loading more stories..." />
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {stories.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center py-8">
              <button
                onClick={onLoadMore}
                className="px-8 py-3 bg-hn-orange text-white rounded-lg hover:bg-orange-600 transition-all hover:shadow-lg font-semibold text-base"
              >
                Load More Stories
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
