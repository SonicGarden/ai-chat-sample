import { getAuth } from 'firebase/auth';
import { AuthProvider as _AuthProvider, useFirebaseApp } from 'reactfire';
import type { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);

  return <_AuthProvider sdk={auth}>{children}</_AuthProvider>;
};
