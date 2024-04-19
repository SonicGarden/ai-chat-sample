import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { ResponsiveLayout, useResponsiveLayoutContext } from '~/components/layouts/ResponsiveLayout';
import { LoadingScreen } from '~/components/screens/LoadingScreen';
import { useAuth } from '~/hooks/firebase/useAuth';
import { AccountMenu } from './_components/AccountMenu';
import { FixedMenu } from './_components/FixedMenu';
import { HeaderTitle } from './_components/HeaderTitle';
import { NavMenu } from './_components/NavMenu';
import type { ReactNode } from 'react';

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { signedIn } = useAuth();

  useEffect(() => {
    if (signedIn === false) navigate('/sign-in');
  }, [signedIn, navigate]);

  if (!signedIn) return <LoadingScreen />;

  return (
    <ResponsiveLayout
      header={{ title: <HeaderTitle /> }}
      navbar={{ fixedMenu: <FixedMenu />, navMenu: <NavMenu />, accountMenu: <AccountMenu /> }}
    >
      {children}
    </ResponsiveLayout>
  );
};

export const NavLink = ResponsiveLayout.NavLink;
export const useDefaultLayout = useResponsiveLayoutContext;
