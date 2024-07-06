import { Button } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { signInWithGoogle } from '~/utils/firebase/auth';
import { notify } from '~/utils/mantine/notifications';

export const SignInWithGoogleForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      notify.info({ message: 'サインインしました' });
      onSubmit?.();
    } catch (error) {
      console.error(error);
      notify.error({ message: 'サインインに失敗しました' });
    } finally {
      setLoading(false);
    }
  }, [onSubmit, setLoading]);

  return (
    <Button
      loading={loading}
      onClick={handleClick}
      variant='default'
      leftSection={<IconBrandGoogle />}
      aria-label='Sign in with Google'
    >
      Sign in with Google
    </Button>
  );
};
