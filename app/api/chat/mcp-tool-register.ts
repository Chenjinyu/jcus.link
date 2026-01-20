import { z } from 'zod';
import { tool } from 'ai';
import {
  generateMatchedResume,
  searchMatchedResumes,
  searchSimilarityContent,
} from '@/app/utils/mcp-client-sdk';
import { EXTENSION_MAP, type SupportedInputType } from './chat-utils';

export const MCP_TOOL_DEFS = {
  searchMatchedResumes: {
    description: 'Search for matching resumes.',
    inputSchema: z.object({
      job_description: z.string(),
      top_k: z.number().int().min(1).max(20).default(5),
    }),
    execute: async ({ job_description, top_k }: { job_description: string; top_k: number }) => {
      return searchMatchedResumes();
    },
  },
  generateMatchedResume: {
    description:
      'Search the profile_data table that matchs the job_description using mcp calling. Use this to get the latest resume generated from mcp server.',
    inputSchema: z.object({
      input_type: z.enum(Object.keys(EXTENSION_MAP)),
      filename: z.string().optional().describe('Filename (required for file type)'),
      input_data: z.string().describe('Job description text, base64-encoded file, or URL'),
      top_k: z.number().int().min(1).max(10).default(5).describe('Number of top matches to return'),
      threshold: z.number(),
    }),
    execute: async ({
      input_type,
      input_data,
      filename,
      top_k,
      threshold,
    }: {
      input_type: keyof typeof EXTENSION_MAP;
      input_data: string;
      filename?: string;
      top_k?: number;
      threshold?: number;
    }) => {
      try {
        const results = generateMatchedResume(
          input_type as SupportedInputType,
          input_data,
          filename ?? '',
          top_k ?? 5,
          threshold ?? 0
        );
        return results;
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to upload job description',
        };
      }
    },
  },
  searchSimilarityContent: {
    description: 'Search the similarity content with embedding text by request mcp server.',
    inputSchema: z.object({
      input_text: z.string(),
      top_k: z.number().int().min(1).max(10).default(5).describe('Number of top matches to return'),
      threshold: z.number(),
    }),
    execute: async ({
      input_text,
      top_k,
      threshold,
    }: {
      input_text: string;
      top_k?: number;
      threshold?: number;
    }) => {
      try {
        const results = await searchSimilarityContent(input_text, top_k, threshold);
        return results;
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Failed to search the similarity with your input',
        };
      }
    },
  },
} as const;

export const buildSelectedTools = (selected: string[]) => {
  return selected.reduce<Record<string, ReturnType<typeof tool>>>((acc, name) => {
    const def = MCP_TOOL_DEFS[name as keyof typeof MCP_TOOL_DEFS];
    if (!def) {
      return acc;
    }
    acc[name] = tool(def as any) as any;
    return acc;
  }, {});
};
