import { Button, Stack } from '@mantine/core';
import { useSearchParams } from '@remix-run/react';
import { IconPlus } from '@tabler/icons-react';
import { useCallback } from 'react';
import { useDefaultLayout } from '../DefaultLayout';

export const FixedMenu = () => {
  const [, setSearchParams] = useSearchParams();
  const { navbar } = useDefaultLayout();
  const handleClickButton = useCallback(() => {
    setSearchParams({});
    navbar.toggle();
  }, [navbar, setSearchParams]);

  return (
    <Stack>
      <Button variant='default' leftSection={<IconPlus size={16} />} onClick={handleClickButton}>
        New Chat
      </Button>
    </Stack>
  );
};
