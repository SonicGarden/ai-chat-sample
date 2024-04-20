import { FieldValue } from 'firebase-admin/firestore';
import { setThreadVector } from '../models/threadVector.js';
import { onTaskDispatched } from '../utils/firebase/functions.js';
import { embedding } from '../utils/openai.js';
import type { ThreadContent } from '@local/shared';

export const embeddingThreadContent = onTaskDispatched(
  { secrets: ['OPENAI_API_KEY'] },
  async ({
    data: { id, uid, messages },
  }: {
    data: { id: string; uid: string; messages: ThreadContent['messages'] };
  }) => {
    const vector = await embedding({ input: JSON.stringify(messages) });
    await setThreadVector({ id, data: { uid, messages: FieldValue.vector(vector) } });
  },
);
