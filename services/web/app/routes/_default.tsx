import { Outlet } from '@remix-run/react';
import { DefaultLayout as _DefaultLayout } from '~/layouts/DefaultLayout';

export default function DefaultLayout() {
  return (
    <_DefaultLayout>
      <Outlet />
    </_DefaultLayout>
  );
}
