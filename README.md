# HN NO AI

A Hacker News clone that filters out all AI-related posts, showing only non-AI content.

## Features

- **Automatic AI Filtering**: Filters out posts related to AI, machine learning, LLMs, and related topics
- **Multiple Feeds**: Browse Top, New, Best, or Show HN stories from Hacker News
- **URL-Based Navigation**: Each feed has its own bookmarkable URL
- **Report AI Content**: Help improve the filter by reporting missed AI posts
- **Dark Mode**: Toggle between light and dark themes
- **Filter Statistics**: See how many AI posts were hidden
- **Infinite Loading**: Load more stories with a single click
- **Clean UI**: Modern, minimal design inspired by Hacker News

## Tech Stack

- React 19 with TypeScript
- Vite
- Tailwind CSS 4
- Hacker News API

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How It Works

The app fetches stories from the Hacker News API and filters them using word-boundary regex matching to detect AI-related keywords in titles and URLs. The filtering is comprehensive, catching terms like:

- AI, artificial intelligence, machine learning
- GPT, ChatGPT, LLM, Claude
- OpenAI, Anthropic, Gemini
- And 50+ other AI-related terms

## Project Structure

```
src/
  components/      # React components
  hooks/           # Custom React hooks
  utils/           # Utility functions (API, filtering, time)
  App.tsx          # Main app component
  main.tsx         # Entry point
```

## License

ISC
