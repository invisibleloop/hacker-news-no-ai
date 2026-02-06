import { useState, useEffect } from "react";
import { HNStory } from "../utils/api";
import { getRelativeTime, extractDomain } from "../utils/time";

interface StoryCardProps {
  story: HNStory;
}

const REPORTED_STORIES_KEY = "hn-reported-stories";

function getReportedStories(): Set<number> {
  try {
    const stored = localStorage.getItem(REPORTED_STORIES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function addReportedStory(storyId: number): void {
  const reported = getReportedStories();
  reported.add(storyId);
  localStorage.setItem(REPORTED_STORIES_KEY, JSON.stringify([...reported]));
}

export function StoryCard({ story }: StoryCardProps) {
  const [isReported, setIsReported] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const domain = extractDomain(story.url);
  const hnUrl = `https://news.ycombinator.com/item?id=${story.id}`;

  useEffect(() => {
    const reported = getReportedStories();
    setIsReported(reported.has(story.id));
  }, [story.id]);

  const handleReport = async () => {
    if (isReported) return;

    try {
      const response = await fetch("https://formspree.io/f/xykpvqkw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: story.title,
          url: story.url || "N/A",
          hnLink: hnUrl,
          author: story.by,
          score: story.score,
          message:
            "User reported this story as AI-related. Please review and add relevant keywords to the filter.",
        }),
      });

      if (response.ok) {
        addReportedStory(story.id);
        setIsReported(true);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } else {
        console.error("Failed to submit report");
      }
    } catch (err) {
      console.error("Failed to submit report:", err);
    }
  };

  return (
    <div className='py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2 -mx-2 rounded-sm'>
      <div className='flex gap-4'>
        <div className='flex flex-col items-center min-w-[3rem]'>
          <span className='text-hn-orange dark:text-orange-400 font-bold text-lg'>
            {story.score}
          </span>
          <span className='text-xs text-hn-gray dark:text-gray-500'>
            points
          </span>
        </div>
        <div className='flex-1'>
          <div className='flex items-baseline gap-2 flex-wrap'>
            {story.url ? (
              <>
                <a
                  href={story.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-hn-orange dark:hover:text-hn-orange transition-colors leading-snug'
                >
                  {story.title}
                </a>
                {domain && (
                  <span className='text-sm text-hn-gray dark:text-gray-400 font-medium'>
                    ({domain})
                  </span>
                )}
              </>
            ) : (
              <a
                href={hnUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-hn-orange dark:hover:text-hn-orange transition-colors leading-snug'
              >
                {story.title}
              </a>
            )}
          </div>
          <div className='text-sm text-hn-gray dark:text-gray-400 mt-2 flex items-center gap-2 flex-wrap'>
            <span className='font-medium'>by {story.by}</span>
            <span className='text-gray-300 dark:text-gray-600'>•</span>
            <span>{getRelativeTime(story.time)}</span>
            <span className='text-gray-300 dark:text-gray-600'>•</span>
            <a
              href={hnUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-hn-orange transition-colors font-medium'
            >
              {story.descendants || 0} comments
            </a>
            <span className='text-gray-300 dark:text-gray-600'>•</span>
            <button
              onClick={handleReport}
              disabled={isReported}
              className={`transition-colors font-medium relative ${
                isReported
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "hover:text-hn-orange"
              }`}
              title={
                isReported
                  ? "Already reported"
                  : "Report this story as AI-related"
              }
            >
              {showCopied
                ? "✓ Reported!"
                : isReported
                  ? "Reported"
                  : "Report as AI content"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
