/**
 * MCP Client using Official TypeScript SDK
 * 
 * This is the RECOMMENDED approach for MCP client implementation.
 * It handles all session management, transport, and protocol details automatically.
 * 
 * Installation: npm install @modelcontextprotocol/sdk
 * 
 * To use this instead of the fetch-based implementation:
 * 1. Install the SDK: npm install @modelcontextprotocol/sdk
 * 2. Import from this file instead of mcp-client.ts
 * 3. The API is the same, but internally uses the official SDK
 */

// Note: Uncomment these imports after installing @modelcontextprotocol/sdk
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8080/mcp';

// Client instance (singleton)
let mcpClient: any = null;
let isInitialized: boolean = false;

/**
 * Initialize MCP client using official SDK
 */
async function getMCPClient(): Promise<any> {
  if (mcpClient && isInitialized) {
    return mcpClient;
  }
  // Create the StreamableHTTP transport
  const transport = new StreamableHTTPClientTransport(
    new URL(MCP_SERVER_URL)
  );
  
  mcpClient = new Client(
    {
      name: "jcus-link-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );
  
  await mcpClient.connect(transport);
  await mcpClient.initialize();
  isInitialized = true;
  return mcpClient;
}


/**
 * Generate a resume based on job description and matched profiles.
 * the resume will include matches and not matches.
 * TODO: the function needs to review, coz it has coverlay with generateMatchedResume
 */
export async function generateResume(
  jobDescription: string,
  matchedResumes: any[],
  jobId?: string
): Promise<string> {
  const client = await getMCPClient();

  const payload: Record<string, any> = {
    matched_resumes: matchedResumes,
    stream: false,
  };
  if (jobDescription) {
    payload.job_description = jobDescription;
  } else if (jobId) {
    payload.job_id = jobId;
  }

  const result = await client.callTool('generate_resume', payload);

  if (result.content && result.content.length > 0) {
    const textContent = result.content.find((c: any) => c.type === 'text');
    if (textContent) {
      return textContent.text;
    }
  }

  throw new Error('Invalid response from MCP server');
}

type SupportedInputType = 'pdf' | 'doc' | 'docs' | 'txt' | 'html' | 'url';

/**
 * Generate a matched resume from a job description file or URL.
 * It includes matched and not-matched work experience.
 */
export async function generateMatchedResume(
  inputType: SupportedInputType,
  inputData: string,
  filename: string,
  topK: number = 10,
  threshold: number = 0.5
): Promise<string> {
  const client = await getMCPClient();

  const payload = {
    input_type: inputType,
    filename: filename,
    input_data: inputData,
    top_k: topK,
    threshold: threshold,
  };

  const result = await client.callTool('generate_matched_resume', payload);

  if (result.content && result.content.length > 0) {
    const textContent = result.content.find((c: any) => c.type === 'text');
    if (textContent) {
      return textContent.text;
    }
  }

  throw new Error('Invalid response from MCP server');
}

export async function searchSimilarityContent(
  inputText: string,
  topK: number = 10,
  threshold: number = 0.7
){
  const client = await getMCPClient();
  console.log("perparing the payload sends to mcp server.");
  const payload = {
    input_text: inputText,
    top_k: topK,
    threshold: threshold,
  };

  const result = await client.callTool('search_similar_content', payload);
  
  if (result.content && result.content.length > 0) {
    const textContent = result.content.find((c: any) => c.type === 'text');
    if (textContent) {
      return textContent.text;
    }
  }

  throw new Error('Invalid response from MCP server');
}

export async function searchMatchedResumes(
){
  console.log("Implemented");
}

/**
 * List all available tools
 */
export async function listMCPTools(): Promise<any[]> {
  const client = await getMCPClient();
  const tools = await client.listTools();
  return tools.tools || [];
}

/**
 * Intelligent tool selector - same as fetch-based version
 */
export async function selectMCPToolsForQuery(query: string): Promise<{
  tools: string[];
  resources: string[];
  prompts: string[];
  reasoning: string;
}> {
  const lowerQuery = query.toLowerCase();
  
  const selectedTools: string[] = [];
  const selectedResources: string[] = [];
  const selectedPrompts: string[] = [];
  let reasoning = '';

  if (
    lowerQuery.includes('work experience') ||
    lowerQuery.includes('working experience') ||
    lowerQuery.includes('background') ||
    lowerQuery.includes('skills') ||
    lowerQuery.includes('position') ||
    lowerQuery.includes('role')
  ) {
    selectedTools.push('searchSimilarityContent');
    reasoning += 'Detected asking author background. ';
  }

  if (
    lowerQuery.includes('find resume') ||
    lowerQuery.includes('match resume') ||
    lowerQuery.includes('search resume') ||
    lowerQuery.includes('matching candidates') ||
    lowerQuery.includes('similar resume')
  ) {
    selectedTools.push('searchMatchedResumes');
    reasoning += 'Detected resume search request. ';
  }

  if (
    lowerQuery.includes('generate resume') ||
    lowerQuery.includes('create resume') ||
    lowerQuery.includes('build resume') ||
    lowerQuery.includes('tailor resume') ||
    lowerQuery.includes('update resume') ||
    lowerQuery.includes('optimize resume')
  ) {
    selectedTools.push('generateMatchedResume');
    selectedPrompts.push('resume_generation_prompt');
    reasoning += 'Detected resume generation request. ';
  }

  if (selectedTools.length === 0) {
    reasoning = 'No specific MCP tools identified for this query.';
  }

  return {
    tools: selectedTools,
    resources: selectedResources,
    prompts: selectedPrompts,
    reasoning,
  };
}
