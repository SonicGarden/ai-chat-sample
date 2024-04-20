import { useState, useMemo } from 'react';
import { useSigninCheck } from 'reactfire';
import type { ParsedToken } from 'firebase/auth';

export const useAuth = () => {
  const [claims, setClaims] = useState<ParsedToken | null | undefined>();
  const { data } = useSigninCheck({
    validateCustomClaims: (userClaims) => {
      setClaims(userClaims);
      return { hasRequiredClaims: true, errors: {} };
    },
  });

  return useMemo(
    () => ({
      user: data?.user,
      claims,
      signedIn: data?.signedIn,
    }),
    [data, claims],
  );
};
