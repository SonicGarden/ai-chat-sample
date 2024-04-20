import { Box } from '@mantine/core';
import { useDefaultLayout } from '~/layouts/DefaultLayout';
import { Chat } from './_components/Chat';

export const Root = () => {
  const {
    main: { height: pageHeight },
  } = useDefaultLayout();

  return (
    <Box h={pageHeight}>
      <Chat height={pageHeight} />
    </Box>
  );
};
