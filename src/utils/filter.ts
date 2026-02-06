import { HNStory } from "./api";

const AI_KEYWORDS = [
  "ai",
  "artificial intelligence",
  "agent",
  "machine learning",
  "ml",
  "deep learning",
  "neural network",
  "llm",
  "llms",
  "large language model",
  "gpt",
  "gpt-4",
  "gpt-5",
  "chatgpt",
  "openai",
  "anthropic",
  "claude",
  "gemini",
  "bard",
  "copilot",
  "github copilot",
  "codex",
  "midjourney",
  "dall-e",
  "dalle",
  "stable diffusion",
  "transformer",
  "transformers",
  "attention mechanism",
  "generative ai",
  "gen ai",
  "genai",
  "langchain",
  "vector database",
  "embeddings",
  "rag",
  "mcp",
  "model context protocol",
  "hugging face",
  "huggingface",
  "llama",
  "mistral",
  "mixtral",
  "moltbook",
  "phi-3",
  "phi-4",
  "diffusion model",
  "foundation model",
  "agi",
  "superintelligence",
  "alignment",
  "prompt engineering",
  "fine-tuning",
  "fine tuning",
  "inference",
  "training run",
  "compute",
  "nvidia",
  "cuda",
  "sam altman",
  "dario amodei",
  "demis hassabis",
  "openclaw",
  "nanoclaw",
];

function createKeywordPatterns(): RegExp[] {
  return AI_KEYWORDS.map((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i");
  });
}

const keywordPatterns = createKeywordPatterns();

export function isAIRelated(text: string): boolean {
  if (!text) return false;

  return keywordPatterns.some((pattern) => pattern.test(text));
}

export function shouldFilterStory(story: HNStory): boolean {
  const titleMatch = isAIRelated(story.title);
  const urlMatch = story.url ? isAIRelated(story.url) : false;

  return titleMatch || urlMatch;
}

export interface FilterResult {
  filtered: HNStory[];
  total: number;
  aiFiltered: number;
}

export function filterStories(stories: HNStory[]): FilterResult {
  const filtered = stories.filter((story) => !shouldFilterStory(story));

  return {
    filtered,
    total: stories.length,
    aiFiltered: stories.length - filtered.length,
  };
}
