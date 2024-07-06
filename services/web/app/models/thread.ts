import { collection, doc, getFirestore, orderBy, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { getConverter } from '~/utils/firebase/firestore';
import { threadContentRef } from './threadContent';
import type { ThreadData, ThreadContentData } from '@local/shared';

export const threadConverter = getConverter<ThreadData>();

export const threadsRef = () => collection(getFirestore(), 'threads').withConverter(threadConverter);

export const threadRef = ({ id }: { id?: string | null }) => (id ? doc(threadsRef(), id) : doc(threadsRef()));

export const threadByUidQuery = ({ uid }: { uid: string }) =>
  query(threadsRef(), where('uid', '==', uid), orderBy('createdAt', 'desc'));

export const createThreadAndContent = async ({
  id,
  uid,
  title,
  model,
  messages,
}: {
  id: string;
  uid: ThreadData['uid'];
  title: ThreadData['title'];
  model: ThreadContentData['model'];
  messages: ThreadContentData['messages'];
}) => {
  const batch = writeBatch(getFirestore());
  batch.set(
    threadRef({ id }),
    { title, uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: false },
  );
  batch.set(
    threadContentRef({ id }),
    { model, uid, messages, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: false },
  );
  await batch.commit();
};
