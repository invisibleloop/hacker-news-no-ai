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
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in-memory
const LS_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes localStorage

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

function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > LS_CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function lsSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage may be full or unavailable; silently skip
  }
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchStoryIds(feedType: FeedType): Promise<number[]> {
  // Check in-memory cache first
  const cached = getCached(feedType, feedCache);
  if (cached) return cached;

  // Fall back to localStorage cache
  const lsCached = lsGet<number[]>(`hn_feed_${feedType}`);
  if (lsCached) {
    setCache(feedType, lsCached, feedCache);
    return lsCached;
  }

  // Fetch from API
  const url = `${BASE_URL}/${feedType}stories.json`;
  const ids = await fetchJSON<number[]>(url);

  setCache(feedType, ids, feedCache);
  lsSet(`hn_feed_${feedType}`, ids);

  return ids;
}

export async function fetchStory(id: number): Promise<HNStory | null> {
  // Check in-memory cache first
  const cached = getCached(id, storyCache);
  if (cached) return cached;

  // Fall back to localStorage cache
  const lsCached = lsGet<HNStory>(`hn_story_${id}`);
  if (lsCached) {
    setCache(id, lsCached, storyCache);
    return lsCached;
  }

  try {
    const url = `${BASE_URL}/item/${id}.json`;
    const story = await fetchJSON<HNStory>(url);

    if (story && story.type === 'story') {
      setCache(id, story, storyCache);
      lsSet(`hn_story_${id}`, story);
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
