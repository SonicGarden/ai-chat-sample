import { Loader as MantineLoader } from '@mantine/core';
import { forwardRef } from 'react';
import type { LoaderProps } from '@mantine/core';

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>((props: LoaderProps, ref) => {
  return <MantineLoader color='gray' type='dots' ref={ref} {...props} />;
});
Loader.displayName = 'Loader';
