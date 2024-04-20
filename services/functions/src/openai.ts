import OpenAI from 'openai';
import { updateThreadContent, throttleUpdateThreadContent } from './models/threadContent.js';
import { env } from './utils/env.js';
import { onCall, logger, HttpsError } from './utils/firebase/functions.js';
import type { Message, ThreadContent } from '@local/shared';

export const openai = onCall<{ threadId: string; model: ThreadContent['model']; messages: Message[] }>(
  { secrets: ['OPENAI_API_KEY'] },
  async ({ data: { threadId, model, messages }, auth }) => {
    if (!auth) {
      throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    try {
      const openai = new OpenAI({ apiKey: env('OPENAI_API_KEY'), organization: env('OPENAI_ORGANIZATION_ID') });
      const stream = openai.beta.chat.completions.stream({
        model,
        messages: messages.map(({ role, contents }) => ({
          role: role === 'human' ? 'user' : 'assistant',
          content: contents[0].value,
        })),
        stream: true,
      });
      let content = '';
      for await (const chunk of stream) {
        content += chunk.choices[0].delta?.content ?? '';
        const newMessages: Message[] = [...messages, { role: 'ai', contents: [{ type: 'text', value: content }] }];
        await throttleUpdateThreadContent({ id: threadId, data: { messages: newMessages } });
      }
      throttleUpdateThreadContent.cancel();
      const chatCompletion = await stream.finalChatCompletion();
      const contentCompletion = chatCompletion.choices[0].message.content ?? '';
      const finalMessages: Message[] = [
        ...messages,
        { role: 'ai', contents: [{ type: 'text', value: contentCompletion }] },
      ];
      await updateThreadContent({ id: threadId, data: { messages: finalMessages } });
      return true;
    } catch (error) {
      logger.error('Failed to openai.', { error });
      throw new HttpsError('internal', 'Failed to openai.');
    }
  },
);
