export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-hn-gray dark:text-gray-400">
            Not affiliated with Y Combinator or Hacker News. Data sourced from the{' '}
            <a
              href="https://github.com/HackerNews/API"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-hn-orange transition-colors underline"
            >
              official Hacker News API
            </a>
            .
          </p>
          <p className="text-sm text-hn-gray dark:text-gray-400">
            This site filters out AI-related content. No user data is collected or stored.
          </p>
          <p className="text-xs text-hn-gray dark:text-gray-500 mt-3">
            Made with ♥ for those seeking AI-free tech news
          </p>
        </div>
      </div>
    </footer>
  );
}
