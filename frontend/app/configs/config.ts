export const MODEL_CONFIG = [
  {
    provider: "ollama",
    modelName: "LLaMA 3.1 8B (Ollama Local)",
    modelVersion: "llama3.1:8b",
    embeddingModel: "mxbai-embed-large:335m",
    reasoningModel: "",
    baseURL: "http://localhost:11434",
  },
  {
    provider: "Groq",
    modelName: "LLaMA 3.1 8B (Groq)",
    modelVersion: "llama-3.1-8b-instant",
    embeddingModel: "text-embedding-3-small",
    reasoningModel: "qwen-qwq-32b",
    baseURL: "https://api.groq.com/openai/v1",
  },
  {
    provider: "openai",
    modelName: "GPT-4o (OpenAI)",
    modelVersion: "gpt-4o",
    embeddingModel: "text-embedding-3-large",
    reasoningModel: "",
    baseURL: "https://api.openai.com/v1",
  },
  {
    provider: "Qwen",
    modelName: "Qwen 3 4B",
    modelVersion: "qwen3:4b",
    reasoningModel: "",
    embeddingModel: "xxx",
    baseURL: "",
  }
];

export let PROMPT_DEFAULT = `You are a helpful assistant. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
if no relevant information is found in the tool calls, respond, "Sorry, I don't know. There is no relevant infomration in my knowledge base."`

export let PROMPT_NEW = `You are a helpful assistant. Check your knowledge base before answering any questions`