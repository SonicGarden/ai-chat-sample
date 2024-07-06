import { Avatar, Box, Group, NavLink, Text } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import { useCallback } from 'react';
import { UnstyledConfirmButton } from '~/components/elements/buttons/UnstyledConfirmButton';
import { useAuth } from '~/hooks/firebase/useAuth';
import { signOut } from '~/utils/firebase/auth';
import { notify } from '~/utils/mantine/notifications';

export const AccountMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleConfirmSignOut = useCallback(async () => {
    await signOut();
    notify.info({
      message: 'サインアウトしました',
    });
  }, []);

  return (
    <Box aria-label='アカウントメニュー'>
      {user ? (
        <>
          <NavLink
            label={
              <Group wrap='nowrap'>
                <Avatar size='sm' />
                <Text truncate='end'>{user.email}</Text>
              </Group>
            }
          >
            <NavLink
              label='サインアウト'
              component={UnstyledConfirmButton}
              message='本当にサインアウトしますか？'
              onConfirm={handleConfirmSignOut}
            />
          </NavLink>
        </>
      ) : (
        <>
          <NavLink label='サインイン' onClick={() => navigate('sign-in', { replace: true })}></NavLink>
        </>
      )}
    </Box>
  );
};
