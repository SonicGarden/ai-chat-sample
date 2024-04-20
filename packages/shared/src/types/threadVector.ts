import type { Timestamp, WithId } from './firebase.js';
import type { VectorValue } from '@google-cloud/firestore';

export type ThreadVectorData = {
  updatedAt: Timestamp;
  uid: string;
  messages: VectorValue;
};

export type ThreadVector = WithId<ThreadVectorData>;
