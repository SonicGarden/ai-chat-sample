import { ResponsiveLayout, useResponsiveLayoutContext } from '~/components/layouts/ResponsiveLayout';
import { AccountMenu } from './_components/AccountMenu';
import { FixedMenu } from './_components/FixedMenu';
import { HeaderTitle } from './_components/HeaderTitle';
import { NavMenu } from './_components/NavMenu';
import type { ReactNode } from 'react';

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
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
