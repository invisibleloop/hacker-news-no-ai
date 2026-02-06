const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  type: string;
  by: string;
  time: number;
  title: string;
  url?: string;
  score: number;
  descendants: number;
}

export type FeedType = 'top' | 'new' | 'best' | 'show';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const storyCache = new Map<number, CacheEntry<HNStory>>();
const feedCache = new Map<FeedType, CacheEntry<number[]>>();

function getCached<T>(key: string | number, cache: Map<any, CacheEntry<T>>): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const age = Date.now() - entry.timestamp;
  if (age > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache<T>(key: string | number, data: T, cache: Map<any, CacheEntry<T>>): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchStoryIds(feedType: FeedType): Promise<number[]> {
  // Check cache first
  const cached = getCached(feedType, feedCache);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const url = `${BASE_URL}/${feedType}stories.json`;
  const ids = await fetchJSON<number[]>(url);

  // Store in cache
  setCache(feedType, ids, feedCache);

  return ids;
}

export async function fetchStory(id: number): Promise<HNStory | null> {
  // Check cache first
  const cached = getCached(id, storyCache);
  if (cached) {
    return cached;
  }

  try {
    const url = `${BASE_URL}/item/${id}.json`;
    const story = await fetchJSON<HNStory>(url);

    if (story && story.type === 'story') {
      // Store in cache
      setCache(id, story, storyCache);
      return story;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch story ${id}:`, error);
    return null;
  }
}

export async function fetchStories(
  ids: number[],
  limit: number = 30
): Promise<HNStory[]> {
  const storyPromises = ids.slice(0, limit).map(id => fetchStory(id));
  const stories = await Promise.all(storyPromises);
  return stories.filter((story): story is HNStory => story !== null);
}

export async function fetchMoreStories(
  ids: number[],
  currentCount: number,
  batchSize: number = 30
): Promise<HNStory[]> {
  const nextIds = ids.slice(currentCount, currentCount + batchSize);
  return fetchStories(nextIds, batchSize);
}
