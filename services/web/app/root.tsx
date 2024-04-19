import { Links, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from '@remix-run/react';
import { FirebaseAppProvider } from 'reactfire';
import { LoadingScreen } from '~/components/screens/LoadingScreen';
import { DefaultLayout } from '~/layouts/DefaultLayout';
import { firebaseConfig } from '~/utils/firebase/config';
import { MantineProvider, ColorSchemeScript } from '~/utils/mantine/provider';
import type { FirebaseOptions } from 'firebase/app';

export async function clientLoader() {
  return json(firebaseConfig());
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  );
}

export default function App() {
  const config = useLoaderData<FirebaseOptions>();

  return (
    <FirebaseAppProvider firebaseConfig={config}>
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </FirebaseAppProvider>
  );
}

export function HydrateFallback() {
  return <LoadingScreen />;
}
