export type Source = {
  url: string;
  title: string;
};

export enum AuthProvider {
  GOOGLE = 'Google',
  FACEBOOK = 'Facebook',
  APPLE = 'Apple',
}

// create User interface object
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: AuthProvider;
}

export type Message = {
  id: string;
  name?: string;
  content: string;
  type: "system" | "human" | "ai" | "function";
  createdAt?: Date;
  sources?: Source[];
  function_call?: { name: string };
};

export type Feedback = {
  feedback_id: string;
  score: number;
  comment?: string;
};

export type ModelOptions =
  | "openai/gpt-4.1-mini"
  | "openai/gpt-5-mini"
  | "openai/gpt-5-nano"
  | "anthropic/claude-3-5-haiku-20241022"
  | "google_genai/gemini-2.0-flash";


export interface KnowledgeChunk {
  id: string;
  content: string;
  keywords: string[];
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}