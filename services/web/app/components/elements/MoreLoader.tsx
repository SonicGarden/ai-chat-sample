import { useIntersection } from '@mantine/hooks';
import { useEffect } from 'react';
import { Loader } from './Loader';
import type { LoaderProps } from '@mantine/core';

export const MoreLoader = ({ loadMore, ...props }: Omit<LoaderProps, 'ref'> & { loadMore?: () => void }) => {
  const { ref, entry } = useIntersection({ threshold: 0.5 });

  useEffect(() => {
    entry?.isIntersecting && loadMore?.();
  }, [entry?.isIntersecting, loadMore]);

  return <Loader ref={ref} {...props} />;
};
