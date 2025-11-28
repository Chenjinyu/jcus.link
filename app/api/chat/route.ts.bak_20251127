import { createResource } from '@/db/actions/resources';
import { deepinfra } from '@ai-sdk/deepinfra';
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/app/lib/embedding';
import { ollamaModel } from '@/app/lib/models/ollama';
import { selectModel } from '@/app/utils/utils';
import { PROMPT_NEW, PROMPT_DEFAULT } from '@/app/configs/config';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages, metadata }: { messages: UIMessage[] , metadata?: any} = await req.json();
  console.log('Incoming messages:', JSON.stringify(messages, null, 2));  
  const lastMessage = messages[messages.length - 1];
  console.log('Last message parts:', lastMessage)
  // const modelSelectionPart = lastMessage.parts.find(
  //   part => part.type === 'model-selection'
  // );
  // const selectedModel = modelSelectionPart?.metadata?.model || 'gpt-4o';
  // Destructure your custom data property
  // type MessageWithMetadata = UIMessage & {
  //   metadata?: {
  //     selectedModelName?: string;
  //     [key: string]: any;
  //   };
  // };

  const {
    metadata: {
      metadataType,
      selectedModelName,
    } = {}
  } = lastMessage;
  console.log('[DEBUG] Selected model from message metadata:', selectedModelName);
  const result = streamText({
    model: selectModel(selectedModelName),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: PROMPT_DEFAULT,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => { 
          console.log('[DEBUG]route.ts.POST.tool.addResource with content:', { content });
          const reps = await createResource({ content })
          console.log('[DEBUG]route.ts.POST.tool.addResource result:', { reps });
        },
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => {
          console.log('[DEBUG]route.ts.POST.tool.getInformation with content:', { question });
          const result = await findRelevantContent(question);
          console.log('[DEBUG]route.ts.POST.tool.getInformation returns:', result);
          return result;
        }
      }),
    },
    onError: (error) => {
      console.error('[DEBUG][POST] Error during AI processing:', error);
    }
  });

  return result.toUIMessageStreamResponse();
}