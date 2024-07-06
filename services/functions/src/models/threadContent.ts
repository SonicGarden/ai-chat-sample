import { throttle } from 'lodash-es';
import { getConverter, getFirestore, serverTimestamp } from '../utils/firebase/firestore.js';
import type { ThreadContentData } from '@local/shared';
import type { UpdateData } from 'firebase-admin/firestore';

export const threadContentConverter = getConverter<ThreadContentData>();

export const threadContentsRef = () =>
  getFirestore().collection('threadContents').withConverter(threadContentConverter);

export const threadContentRef = ({ id }: { id: string }) => threadContentsRef().doc(id);

export const updateThreadContent = async ({ id, data }: { id: string; data: UpdateData<ThreadContentData> }) =>
  threadContentRef({ id }).update({ updatedAt: serverTimestamp(), ...data });

export const throttleUpdateThreadContent = throttle(updateThreadContent, 3000);
