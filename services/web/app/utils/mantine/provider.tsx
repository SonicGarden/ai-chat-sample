import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript as _ColorSchemeScript, MantineProvider as _MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';

const defaultColorScheme = 'dark';

export const ColorSchemeScript = () => <_ColorSchemeScript defaultColorScheme={defaultColorScheme} />;

export const MantineProvider = ({ children }: { children: ReactNode }) => {
  return (
    <_MantineProvider defaultColorScheme={defaultColorScheme}>
      <Notifications />
      <ModalsProvider>{children}</ModalsProvider>
    </_MantineProvider>
  );
};
