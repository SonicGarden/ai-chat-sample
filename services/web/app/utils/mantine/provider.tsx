import '@mantine/core/styles.css';
import { ColorSchemeScript as _ColorSchemeScript, MantineProvider as _MantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';

const defaultColorScheme = 'dark';

export const ColorSchemeScript = () => <_ColorSchemeScript defaultColorScheme={defaultColorScheme} />;

export const MantineProvider = ({ children }: { children: ReactNode }) => {
  return <_MantineProvider defaultColorScheme={defaultColorScheme}>{children}</_MantineProvider>;
};
