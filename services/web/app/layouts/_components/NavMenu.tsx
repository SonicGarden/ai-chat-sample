import { Stack, NavLink } from '@mantine/core';
import { useSearchParams } from '@remix-run/react';
import Markdown from 'react-markdown';
import { InfiniteScroll } from '~/components/elements/InfiniteScroll';
import { useAuth } from '~/hooks/firebase/useAuth';
import { usePaginatedCollectionData } from '~/hooks/firebase/usePaginatedCollectionData';
import { threadByUidQuery } from '~/models/thread';
import classes from './_styles/NavMenu.module.css';

export const NavMenu = () => {
  const [, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    data: threads,
    loading,
    hasMore,
    loadMore,
  } = usePaginatedCollectionData(threadByUidQuery({ uid: user!.uid }), { limit: 20 });

  return (
    <Stack>
      <InfiniteScroll loading={loading} hasMore={hasMore} loadMore={loadMore} loaderProps={{ size: 'sm', mx: 'auto' }}>
        {threads?.map((thread) => (
          <NavLink
            key={thread.id}
            label={
              <Markdown components={{ p: ({ children }) => <p className={classes.label}>{children}</p> }}>
                {thread.title}
              </Markdown>
            }
            onClick={() => setSearchParams({ threadId: thread.id })}
          />
        ))}
      </InfiniteScroll>
    </Stack>
  );
};
