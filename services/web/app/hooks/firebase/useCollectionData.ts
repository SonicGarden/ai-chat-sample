import { useFirestoreCollectionData } from 'reactfire';
import type { Query } from 'firebase/firestore';

export const useCollectionData = <T>(query: Query<T>) => {
  return useFirestoreCollectionData(query, { initialData: [], idField: 'id' });
};
