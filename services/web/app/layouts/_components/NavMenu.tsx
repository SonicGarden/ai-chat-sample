import { Stack, NavLink, ActionIcon, Group } from '@mantine/core';
import { useSearchParams } from '@remix-run/react';
import { IconTrash } from '@tabler/icons-react';
import { useCallback } from 'react';
import Markdown from 'react-markdown';
import { InfiniteScroll } from '~/components/elements/InfiniteScroll';
import { UnstyledConfirmButton } from '~/components/elements/buttons/UnstyledConfirmButton';
import { useAuth } from '~/hooks/firebase/useAuth';
import { usePaginatedCollectionData } from '~/hooks/firebase/usePaginatedCollectionData';
import { deleteThreadAndContent, threadByUidQuery } from '~/models/thread';
import { notify } from '~/utils/mantine/notifications';
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
  const handleConfirmDelete = useCallback(async (threadId: string) => {
    try {
      await deleteThreadAndContent({ id: threadId });
      notify.info({ message: '削除しました' });
    } catch (error) {
      console.error(error);
      notify.error({ message: '削除に失敗しました' });
    }
  }, []);

  return (
    <Stack>
      <InfiniteScroll loading={loading} hasMore={hasMore} loadMore={loadMore} loaderProps={{ size: 'sm', mx: 'auto' }}>
        {threads?.map((thread) => (
          <Group key={thread.id} justify='space-between' wrap='nowrap'>
            <NavLink
              key={thread.id}
              label={
                <Markdown components={{ p: ({ children }) => <p className={classes.label}>{children}</p> }}>
                  {thread.title}
                </Markdown>
              }
              onClick={() => setSearchParams({ threadId: thread.id })}
            />
            <ActionIcon
              variant='subtle'
              size='sm'
              color='dark'
              component={UnstyledConfirmButton}
              message='本当に削除しますか？'
              onConfirm={() => handleConfirmDelete(thread.id)}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        ))}
      </InfiniteScroll>
    </Stack>
  );
};
