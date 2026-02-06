import { useState, useEffect, useCallback } from 'react';
import { FeedType, HNStory, fetchStoryIds, fetchMoreStories } from '../utils/api';
import { filterStories, FilterResult } from '../utils/filter';

interface UseStoriesReturn {
  stories: HNStory[];
  loading: boolean;
  error: string | null;
  filterStats: { total: number; aiFiltered: number };
  hasMore: boolean;
  loadMore: () => void;
}

const BATCH_SIZE = 50;

export function useStories(feedType: FeedType): UseStoriesReturn {
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [stories, setStories] = useState<HNStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStats, setFilterStats] = useState({ total: 0, aiFiltered: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialStories() {
      try {
        setLoading(true);
        setError(null);
        setStories([]);
        setCurrentIndex(0);

        const ids = await fetchStoryIds(feedType);
        if (cancelled) return;

        setStoryIds(ids);

        const initialStories = await fetchMoreStories(ids, 0, BATCH_SIZE);
        if (cancelled) return;

        const result: FilterResult = filterStories(initialStories);
        setStories(result.filtered);
        setFilterStats({ total: result.total, aiFiltered: result.aiFiltered });
        setCurrentIndex(BATCH_SIZE);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load stories');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialStories();

    return () => {
      cancelled = true;
    };
  }, [feedType]);

  const loadMore = useCallback(async () => {
    if (loading || currentIndex >= storyIds.length) return;

    try {
      setLoading(true);
      const moreStories = await fetchMoreStories(storyIds, currentIndex, BATCH_SIZE);
      const result: FilterResult = filterStories(moreStories);

      setStories(prev => [...prev, ...result.filtered]);
      setFilterStats(prev => ({
        total: prev.total + result.total,
        aiFiltered: prev.aiFiltered + result.aiFiltered,
      }));
      setCurrentIndex(prev => prev + BATCH_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more stories');
    } finally {
      setLoading(false);
    }
  }, [storyIds, currentIndex, loading]);

  return {
    stories,
    loading,
    error,
    filterStats,
    hasMore: currentIndex < storyIds.length,
    loadMore,
  };
}
