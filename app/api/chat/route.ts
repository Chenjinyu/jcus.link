import { convertToModelMessages, stepCountIs, streamText } from 'ai';
import { envConfig } from '@/app/configs/environment';
import { register, PROMPT_DEFAULT } from '@/app/utils/ai-model-services/ModelRegistry';
import {
  generateMatchedResume,
  selectMCPToolsForQuery,
} from '@/app/utils/mcp-client-sdk';
import {
  resolveInputType,
  SupportedInputType,
  getFilename,
  isHttpUrl,
  extractBase64FromDataUrl,
  extractFirstUrl,
  extractUserQuery,
  getMessageAttachments
} from './chat-utils';
import { buildSelectedTools } from './mcp-tool-register';

console.log(`[INIT] Chat route loaded in ${envConfig.env} environment`);
export const maxDuration = 60; // Increased for MCP operations

export async function POST(req: Request) {
  if (envConfig.debugMode) {
    console.log(`[CHAT] POST /api/chat called in ${envConfig.env} environment`);
  }

  try {
    const body = await req.json();
    const messages = body.messages || [];
    const selectedModel = body.selectedModel || envConfig.defaultModel;

    if (messages.length === 0) {
      throw new Error('No messages provided');
    }

    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const userQuery = extractUserQuery(lastUserMessage);
    const attachments = lastUserMessage ? getMessageAttachments(lastUserMessage) : [];
    const mcpToolSelection = await selectMCPToolsForQuery(userQuery);
    const hasMcpIntent = mcpToolSelection.tools.length > 0;
    const urlFromText = extractFirstUrl(userQuery);
    const hasSourceData = attachments.length > 0 || Boolean(urlFromText);
    const shouldProcessMcp = hasMcpIntent && hasSourceData;

    if (shouldProcessMcp) {
      const supportedFile = attachments.find((file: any) => resolveInputType(file));
      const resolvedUrl = !supportedFile ? urlFromText : null;

      if (!supportedFile && !resolvedUrl) {
        const missingInputResponse = streamText({
          model: register.languageModel(selectedModel),
          messages: convertToModelMessages(messages),
          system: `${PROMPT_DEFAULT}\n\nAsk the user to upload a pdf/doc/docs/txt/html file or provide a URL to the job description.`,
        });
        return missingInputResponse.toUIMessageStreamResponse();
      }

      let inputData = '';
      const sourceFile = supportedFile || { url: resolvedUrl };
      const inputType = resolveInputType(sourceFile);
      if (!inputType) {
        return new Response(
          JSON.stringify({
            error: 'Unsupported file type',
            details: 'Supported types: pdf, doc, docs, txt, html, url.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const filename = getFilename(sourceFile, 'job_description');

      if (inputType === 'url') {
        const url = typeof sourceFile?.url === 'string' ? sourceFile.url : '';
        if (!url || !isHttpUrl(url)) {
          return new Response(
            JSON.stringify({
              error: 'Invalid URL input',
              details: 'Provide a valid http(s) URL for url inputs.',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        inputData = url;
      } else {
        const dataUrl = typeof sourceFile?.url === 'string' ? sourceFile.url : '';
        const base64 = dataUrl ? extractBase64FromDataUrl(dataUrl) : null;
        if (!base64) {
          return new Response(
            JSON.stringify({
              error: 'Invalid file payload',
              details: 'Expected a base64 data URL for file uploads.',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
        inputData = base64;
      }

      const mcpResult = await generateMatchedResume(
        inputType as SupportedInputType,
        inputData,
        filename,
        10,
        0.5
      );

      const mcpResponse = streamText({
        model: register.languageModel(selectedModel),
        messages: convertToModelMessages(messages),
        system: `${PROMPT_DEFAULT}\n\nThe MCP server returned the following result. Respond with it only.\n\n${mcpResult}`,
      });

      return mcpResponse.toUIMessageStreamResponse();
    }

    const result = streamText({
      model: register.languageModel(selectedModel),
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(10),
      system: PROMPT_DEFAULT,
      tools: buildSelectedTools(mcpToolSelection.tools),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[ERROR] POST /api/chat:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: errorMsg,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
