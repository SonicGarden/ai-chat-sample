import { Outlet } from '@remix-run/react';
import { AuthLayout as _AuthLayout } from '~/layouts/AuthLayout';

export default function AuthLayout() {
  return (
    <_AuthLayout>
      <Outlet />
    </_AuthLayout>
  );
}
