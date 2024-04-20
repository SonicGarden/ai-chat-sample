/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFunctions } from 'firebase-admin/functions';
import { https, logger } from 'firebase-functions/v2';
import { onDocumentDeleted as _onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { onCall as _onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/identity';
import { onTaskDispatched as _onTaskDispatched } from 'firebase-functions/v2/tasks';
import type { DocumentOptions, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import type { CallableOptions, CallableRequest } from 'firebase-functions/v2/https';
import type { TaskQueueOptions, Request } from 'firebase-functions/v2/tasks';

export const defaultRegion = 'asia-northeast1';

type OnCallHandler<T> = (request: CallableRequest<T>) => Promise<any>;
const onCall = <T>(optsOrHandler: CallableOptions | OnCallHandler<T>, _handler?: OnCallHandler<T>) => {
  const handler = _handler ?? (optsOrHandler as OnCallHandler<T>);
  return _onCall<T>({ region: defaultRegion, memory: '1GiB', timeoutSeconds: 300, ...optsOrHandler }, handler);
};

type OnDocumentDeletedHandler = (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => Promise<void>;
const onDocumentDeleted = (opts: DocumentOptions, handler: OnDocumentDeletedHandler) => {
  return _onDocumentDeleted({ region: defaultRegion, memory: '1GiB', timeoutSeconds: 300, ...opts }, handler);
};

type OnTaskDispatchedHandler = (request: Request) => Promise<void>;
const onTaskDispatched = (
  optsOrHandler: TaskQueueOptions | OnTaskDispatchedHandler,
  _handler?: OnTaskDispatchedHandler,
) => {
  const handler = _handler ?? (optsOrHandler as OnTaskDispatchedHandler);
  return _onTaskDispatched({ region: defaultRegion, memory: '1GiB', timeoutSeconds: 300, ...optsOrHandler }, handler);
};

const taskQueues = {
  embeddingThreadContent: getFunctions().taskQueue(
    `locations/${defaultRegion}/functions/taskQueues-embeddingThreadContent`,
  ),
};

export { https, logger, HttpsError, onCall, onDocumentDeleted, onTaskDispatched, taskQueues };
