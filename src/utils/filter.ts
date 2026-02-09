import { HNStory } from "./api";

const AI_KEYWORDS = [
  "agent",
  "agentic",
  "agi",
  "ai",
  "alignment",
  "anthropic",
  "artificial intelligence",
  "attention mechanism",
  "bard",
  "chatgpt",
  "claude",
  "codex",
  "compute",
  "copilot",
  "cuda",
  "dall-e",
  "dalle",
  "dario amodei",
  "deep learning",
  "demis hassabis",
  "diffusion model",
  "embeddings",
  "fine tuning",
  "fine-tuning",
  "foundation model",
  "gemini",
  "gen ai",
  "genai",
  "generative ai",
  "github copilot",
  "gpt-4",
  "gpt-5",
  "gpt",
  "hugging face",
  "huggingface",
  "inference",
  "langchain",
  "large language model",
  "llama",
  "llm",
  "llms",
  "machine learning",
  "mcp",
  "midjourney",
  "mistral",
  "mixtral",
  "ml",
  "model context protocol",
  "moltbook",
  "nanoclaw",
  "neural network",
  "nvidia",
  "openai",
  "openclaw",
  "phi-3",
  "phi-4",
  "prompt engineering",
  "rag",
  "sam altman",
  "stable diffusion",
  "superintelligence",
  "training run",
  "transformer",
  "transformers",
  "vector database",
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
