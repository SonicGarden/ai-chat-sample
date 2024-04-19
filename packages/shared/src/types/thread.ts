import type { Timestamp, WithId } from './firebase.js';

export type ThreadData = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  title: string;
  uid: string;
};

export type Thread = WithId<ThreadData>;
