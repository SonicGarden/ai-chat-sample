import { VertexAI } from '@google-cloud/vertexai';
import { updateThreadContent } from './models/threadContent.js';
import { onCall, logger, HttpsError, defaultRegion } from './utils/firebase/functions.js';
import type { Message, ThreadContent } from '@local/shared';

export const geminiPro = onCall<{ threadId: string; model: ThreadContent['model']; messages: Message[] }>(
  async ({ data: { threadId, model, messages }, auth }) => {
    if (!auth) {
      throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const vertexAI = new VertexAI({ project: process.env.GCLOUD_PROJECT!, location: defaultRegion });
      const generativeModel = vertexAI.getGenerativeModel({ model });
      const request = {
        contents: messages.map(({ role, contents }) => ({
          role: role === 'human' ? 'user' : 'model',
          parts: [{ text: contents[0].value }],
        })),
      };
      const streamingResponse = await generativeModel.generateContentStream(request);
      let text = '';
      for await (const response of streamingResponse.stream) {
        const currentContent = response?.candidates?.[0].content;
        text += currentContent?.parts[0].text ?? '';
        const newMessages: Message[] = [...messages, { role: 'ai', contents: [{ type: 'text', value: text }] }];
        await updateThreadContent({ id: threadId, data: { messages: newMessages } });
      }
      return true;
    } catch (error) {
      logger.error('Failed to geminiPro.', { error });
      throw new HttpsError('internal', 'Failed to geminiPro.');
    }
  },
);
