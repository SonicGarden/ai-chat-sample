import { getApp } from 'firebase/app';
import { httpsCallable as _httpsCallable, getFunctions } from 'firebase/functions';
import type { Message, ThreadContent } from '@local/shared';

const httpsCallable = <Request, Response>(name: string) =>
  _httpsCallable<Request, Response>(getFunctions(getApp(), 'asia-northeast1'), name);

type GeminiProRequest = { threadId: string; model: ThreadContent['model']; messages: Message[] };
export const geminiPro = (request: GeminiProRequest) => httpsCallable<GeminiProRequest, boolean>('geminiPro')(request);
