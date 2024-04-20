import type { Timestamp, WithId } from './firebase.js';

export type Message = {
  role: 'human' | 'ai';
  contents: {
    type: 'text';
    value: string;
  }[];
};

export const models = ['gemini-pro', 'gpt-3.5-turbo', 'gpt-4-turbo'] as const;

export type ThreadContentData = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  model: (typeof models)[number];
  messages: Message[];
  uid: string;
};

export type ThreadContent = WithId<ThreadContentData>;
