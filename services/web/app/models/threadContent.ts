import { collection, doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getConverter } from '~/utils/firebase/firestore';
import type { ThreadContentData } from '@local/shared';
import type { UpdateData } from 'firebase/firestore';

export const threadContentConverter = getConverter<ThreadContentData>();

export const threadContentsRef = () =>
  collection(getFirestore(), 'threadContents').withConverter(threadContentConverter);

export const threadContentRef = ({ id }: { id?: string | null }) =>
  id ? doc(threadContentsRef(), id) : doc(threadContentsRef());

export const updateThreadContent = async ({ id, data }: { id: string; data: UpdateData<ThreadContentData> }) =>
  updateDoc(threadContentRef({ id }), { ...data, updatedAt: serverTimestamp() });
