# AI-Free Hacker News Clone

Build a Hacker News clone that filters out all AI-related posts, showing only non-AI content.

## Project Overview

A web app that fetches stories from the Hacker News API and displays them in a clean interface, automatically hiding any posts related to AI, machine learning, LLMs, etc.

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Deployment**: Static site (can be hosted anywhere)

## Features

### Core Features

1. Display top/new/best stories from HN (default to top)
2. Filter out AI-related posts automatically
3. Show story title, points, author, time, and comment count
4. Link to original article and HN comments
5. Pagination or infinite scroll (load 30 stories at a time)
6. Toggle between Top/New/Best stories

### Nice to Have

- Dark mode
- Show how many posts were filtered out
- Local storage to remember preferences
- Search within filtered results

## Hacker News API

Base URL: `https://hacker-news.firebaseio.com/v0/`

### Endpoints

- `/topstories.json` - Array of top story IDs (up to 500)
- `/newstories.json` - Array of new story IDs
- `/beststories.json` - Array of best story IDs
- `/item/{id}.json` - Individual item details

### Item Structure

```json
{
  "id": 123,
  "type": "story",
  "by": "username",
  "time": 1234567890,
  "title": "Story Title",
  "url": "https://example.com/article",
  "score": 100,
  "descendants": 50
}
```

## AI Filtering Logic

Filter out posts where the title OR URL contains AI-related terms.

### Keywords to Filter (case-insensitive, word boundaries)

```
ai, artificial intelligence, machine learning, ml, deep learning,
neural network, llm, llms, large language model,
gpt, gpt-4, gpt-5, chatgpt, openai, anthropic, claude,
gemini, bard, copilot, github copilot,
midjourney, dall-e, dalle, stable diffusion,
transformer, transformers, attention mechanism,
generative ai, gen ai, genai,
langchain, vector database, embeddings, rag,
hugging face, huggingface,
llama, mistral, mixtral, phi-3, phi-4,
diffusion model, foundation model,
agi, superintelligence, alignment,
prompt engineering, fine-tuning, fine tuning,
inference, training run, compute,
nvidia, cuda (when in AI context),
sam altman, dario amodei, demis hassabis
```

### Word Boundary Matching

Use regex with word boundaries to avoid false positives:

- "ai" should NOT match "again", "domain", "ertain"
- "ml" should NOT match "html", "xml"

Example regex pattern for "ai":

```javascript
/\bai\b/i;
```

### Edge Cases to Handle

- "AI" as standalone word ✓ filter
- "again" ✗ don't filter
- "OpenAI" ✓ filter
- "email" ✗ don't filter
- "ML engineer" ✓ filter
- "HTML" ✗ don't filter

## UI/UX Requirements

### Layout

- Clean, minimal design inspired by HN but more modern
- Max width container (800px) centered
- Mobile responsive

### Story Card

```
[Score] Title (domain.com)
        by author | 3 hours ago | 42 comments
```

### Header

- Site title: "HN sans AI" or similar clever name
- Navigation: Top | New | Best
- Optional: Filter stats "Showing 28 of 30 stories (2 AI posts hidden)"

### Colors (Light Mode)

- Background: #f6f6ef (HN beige) or white
- Text: #333
- Links: #ff6600 (HN orange)
- Meta text: #828282

### Colors (Dark Mode)

- Background: #1a1a1a
- Text: #e0e0e0
- Links: #ff6600
- Meta text: #828282

## Implementation Steps

1. **Setup**
   - Initialize Vite + React + TypeScript project
   - Add Tailwind CSS
   - Set up project structure

2. **API Layer**
   - Create functions to fetch story IDs
   - Create function to fetch individual stories
   - Implement batched fetching (fetch 30 at a time)
   - Add error handling and loading states

3. **Filtering**
   - Implement keyword matching with word boundaries
   - Create filter function that checks title and URL
   - Track filtered count for stats

4. **Components**
   - Header with navigation
   - StoryList container
   - StoryCard component
   - LoadMore button or infinite scroll
   - Loading skeleton

5. **State Management**
   - Current feed type (top/new/best)
   - Stories array
   - Loading state
   - Filter stats

6. **Polish**
   - Add dark mode toggle
   - Relative time formatting ("3 hours ago")
   - Domain extraction from URLs
   - Error states and retry logic

## File Structure

```
src/
  components/
    Header.tsx
    StoryCard.tsx
    StoryList.tsx
    LoadingSpinner.tsx
  hooks/
    useStories.ts
  utils/
    api.ts
    filter.ts
    time.ts
  App.tsx
  main.tsx
  index.css
```

## Performance Considerations

- Fetch stories in parallel (Promise.all) but limit concurrency
- Cache fetched stories to avoid refetching
- Show loading skeletons while fetching
- Consider using React Query or SWR for caching

## Testing the Filter

Make sure these get filtered:

- "Show HN: I built an AI assistant"
- "OpenAI announces GPT-5"
- "The state of ML in 2024"

Make sure these DON'T get filtered:

- "Again, the importance of testing"
- "Domain-driven design patterns"
- "HTML over the wire"
