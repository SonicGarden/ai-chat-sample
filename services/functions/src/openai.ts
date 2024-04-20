import dedent from 'dedent';
import OpenAI from 'openai';
import { updateThreadContent, throttleUpdateThreadContent, threadContentRef } from './models/threadContent.js';
import { threadVectorsRef } from './models/threadVector.js';
import { env } from './utils/env.js';
import { getCollectionData, getDocumentData } from './utils/firebase/firestore.js';
import { onCall, logger, HttpsError, taskQueues } from './utils/firebase/functions.js';
import { embedding } from './utils/openai.js';
import type { Message, ThreadContent } from '@local/shared';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export const openai = onCall<{ threadId: string; model: ThreadContent['model']; messages: Message[] }>(
  { secrets: ['OPENAI_API_KEY'] },
  async ({ data: { threadId, model, messages }, auth }) => {
    if (!auth) {
      throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    try {
      const openai = new OpenAI({ apiKey: env('OPENAI_API_KEY'), organization: env('OPENAI_ORGANIZATION_ID') });
      const query = await embedding({ input: JSON.stringify(messages.at(-1)), openai });
      const similarVectors = await getCollectionData(
        threadVectorsRef()
          .where('uid', '==', auth.uid)
          .findNearest('messages', query, { limit: 4, distanceMeasure: 'COSINE' }),
      );
      // NOTE: 不等式フィルタとベクトル検索の組み合わせがサポートされていないのでここで同じthreadIdを除外している
      const similarThreadContents = await Promise.all(
        similarVectors
          .filter(({ id }) => id !== threadId)
          .map(async ({ id }) => (await getDocumentData(threadContentRef({ id }))).data),
      );
      const instruction = dedent(`
        # Instruction
        1. Analyze the provided past thread data.
          - The data is provided in JSON format.
          - Each thread is stored with its thread ID as the key.
        2. Search for content similar to the current question in the past thread data.
        3. If a similar question is found, determine if it meets the following condition:
          - The answer to the similar question can be considered effective for the current question.
        4. If the condition is met, generate a response following these steps:
          a. Generate the response in the same language as the input.
          b. Format the response according to the specified response format.
          c. Translate the fixed phrases in the response format to the same language as the input.
          d. Include a list of all the thread IDs that meet the condition in the response format, each as a separate bullet point.
        5. If no similar question is found or the condition is not met, generate a response to the current question as usual.
        # Response Format
        {Current answer}
        The following responses might also be helpful for reference:
        - <https://${process.env.GCLOUD_PROJECT}.web.app/?threadId={threadID1}>
        - <https://${process.env.GCLOUD_PROJECT}.web.app/?threadId={threadID2}>
        ...
        - <https://${process.env.GCLOUD_PROJECT}.web.app/?threadId={threadIDN}>
        # Past Thread Data
        ${JSON.stringify(
          similarThreadContents.reduce(
            (acc, { id, messages }) => ({
              ...acc,
              [id]: messages.map(({ role, contents }) => [role, contents[0].value]),
            }),
            {},
          ),
        )}
      `);
      const stream = openai.beta.chat.completions.stream({
        model,
        messages: [
          { role: 'system', content: instruction },
          ...messages.map(({ role, contents }) => ({
            role: role === 'human' ? 'user' : 'assistant',
            content: contents[0].value,
          })),
        ] as ChatCompletionMessageParam[],
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
      await Promise.all([
        updateThreadContent({ id: threadId, data: { messages: finalMessages } }),
        taskQueues.embeddingThreadContent.enqueue({ id: threadId, uid: auth.uid, messages: finalMessages }),
      ]);
      return true;
    } catch (error) {
      logger.error('Failed to openai.', { error });
      throw new HttpsError('internal', 'Failed to openai.');
    }
  },
);
