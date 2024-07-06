import { Stack, NavLink } from '@mantine/core';
import { useSearchParams } from '@remix-run/react';
import Markdown from 'react-markdown';
import { useAuth } from '~/hooks/firebase/useAuth';
import { useCollectionData } from '~/hooks/firebase/useCollectionData';
import { threadByUidQuery } from '~/models/thread';
import classes from './_styles/NavMenu.module.css';

export const NavMenu = () => {
  const [, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: threads } = useCollectionData(threadByUidQuery({ uid: user!.uid }));

  return (
    <Stack>
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
    </Stack>
  );
};
