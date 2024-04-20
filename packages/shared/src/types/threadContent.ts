import type { Timestamp, WithId } from './firebase.js';

export type Message = {
  role: 'human' | 'ai';
  contents: {
    type: 'text';
    value: string;
  }[];
};

export type ThreadContentData = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  model: 'gemini-pro';
  messages: Message[];
  uid: string;
};

export type ThreadContent = WithId<ThreadContentData>;
