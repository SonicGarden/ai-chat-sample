import { Loader as MantineLoader } from '@mantine/core';
import type { LoaderProps } from '@mantine/core';

export const Loader = (props: LoaderProps) => {
  return <MantineLoader color='gray' type='dots' {...props} />;
};
