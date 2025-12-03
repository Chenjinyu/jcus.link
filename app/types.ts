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

// Role	       |     Purpose	                     |      Visibility
// "user"	     | Messages from the person chatting | Displayed in chat (right-aligned)
// "assistant" |	Responses from the AI model	     | Displayed in chat (left-aligned)
// "system"	   | Instructions for the AI model	   | Typically hidden from users

// Example of system messages: 
// "You are a helpful coding assistant. Always provide clear explanations."
// "Respond in concise bullet points."
// "Always cite your sources."
export type MessageRole = 'user' | 'assistant' | 'system';

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