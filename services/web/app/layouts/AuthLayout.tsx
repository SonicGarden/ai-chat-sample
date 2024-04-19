import { ResponsiveLayout, useResponsiveLayoutContext } from '~/components/layouts/ResponsiveLayout';
import { HeaderTitle } from './_components/HeaderTitle';
import type { ReactNode } from 'react';

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <ResponsiveLayout header={{ title: <HeaderTitle /> }}>{children}</ResponsiveLayout>;
};

export const useAuthLayout = useResponsiveLayoutContext;
