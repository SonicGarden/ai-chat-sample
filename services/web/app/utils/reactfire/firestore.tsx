import { getFirestore } from 'firebase/firestore';
import { FirestoreProvider as _FirestoreProvider, useFirebaseApp } from 'reactfire';
import type { ReactNode } from 'react';

export const FirestoreProvider = ({ children }: { children: ReactNode }) => {
  const app = useFirebaseApp();
  const firestore = getFirestore(app);

  return <_FirestoreProvider sdk={firestore}>{children}</_FirestoreProvider>;
};
