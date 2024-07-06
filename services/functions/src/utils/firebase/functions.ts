/* eslint-disable @typescript-eslint/no-explicit-any */
import { https, logger } from 'firebase-functions/v2';
import { onCall as _onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/identity';
import type { CallableOptions, CallableRequest } from 'firebase-functions/v2/https';

export const defaultRegion = 'asia-northeast1';

type OnCallHandler<T> = (request: CallableRequest<T>) => Promise<any>;
const onCall = <T>(optsOrHandler: CallableOptions | OnCallHandler<T>, _handler?: OnCallHandler<T>) => {
  const handler = _handler ?? (optsOrHandler as OnCallHandler<T>);
  return _onCall<T>({ region: defaultRegion, memory: '1GiB', timeoutSeconds: 300, ...optsOrHandler }, handler);
};

export { https, logger, HttpsError, onCall };
