import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { ResponsiveLayout, useResponsiveLayoutContext } from '~/components/layouts/ResponsiveLayout';
import { LoadingScreen } from '~/components/screens/LoadingScreen';
import { useAuth } from '~/hooks/firebase/useAuth';
import { HeaderTitle } from './_components/HeaderTitle';
import type { ReactNode } from 'react';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { signedIn } = useAuth();

  useEffect(() => {
    if (signedIn === true) navigate('/');
  }, [signedIn, navigate]);

  if (signedIn === undefined) return <LoadingScreen />;

  return <ResponsiveLayout header={{ title: <HeaderTitle /> }}>{children}</ResponsiveLayout>;
};

export const useAuthLayout = useResponsiveLayoutContext;
