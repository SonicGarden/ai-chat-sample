import { MoreLoader } from './MoreLoader';
import type { LoaderProps } from '@mantine/core';
import type { ReactNode } from 'react';

export const InfiniteScroll = ({
  loading,
  hasMore,
  loadMore,
  children,
  loaderProps,
}: {
  loading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  children: ReactNode;
  loaderProps?: Omit<LoaderProps, 'ref'>;
}) => {
  return (
    <>
      {children}
      {(loading || hasMore) && <MoreLoader {...(hasMore && { loadMore })} {...loaderProps} />}
    </>
  );
};
