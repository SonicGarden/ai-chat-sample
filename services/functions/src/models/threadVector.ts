import { getConverter, getFirestore, serverTimestamp } from '../utils/firebase/firestore.js';
import type { ThreadVectorData } from '@local/shared';

export const threadVectorConverter = getConverter<ThreadVectorData>();

export const threadVectorsRef = () => getFirestore().collection('threadVectors').withConverter(threadVectorConverter);

export const threadVectorRef = ({ id }: { id: string }) => threadVectorsRef().doc(id);

export const setThreadVector = async ({ id, data }: { id: string; data: Partial<ThreadVectorData> }) =>
  threadVectorRef({ id }).set({ updatedAt: serverTimestamp(), ...data }, { merge: true });

export const deleteThreadVector = async ({ id }: { id: string }) => threadVectorRef({ id }).delete();
