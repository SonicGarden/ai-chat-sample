import { useFirestoreDocData } from 'reactfire';
import type { DocumentReference } from 'firebase/firestore';

export const useDocumentData = <T>(ref: DocumentReference<T>) => {
  return useFirestoreDocData(ref, { idField: 'id' });
};
