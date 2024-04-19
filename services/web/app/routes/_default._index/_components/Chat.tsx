import { ActionIcon, Box, Group, Stack, Textarea } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { IconSend } from '@tabler/icons-react';
import classes from './_styles/Chat.module.css';

const FORM_MARGIN = 32;

export const Chat = ({ height }: { height: number }) => {
  const { ref: formRef, height: formHeight } = useElementSize();
  const scrollAreaHeight = height - formHeight - FORM_MARGIN * 2;

  return (
    <Stack gap={0} justify='space-between'>
      <Box h={scrollAreaHeight} className={classes.messages}>
        {[...new Array(20)].map((_, index) => (
          <Box key={index} p={16}>
            Message {index + 1}
          </Box>
        ))}
      </Box>
      <Group wrap='nowrap' m={FORM_MARGIN} ref={formRef}>
        <Textarea
          placeholder='Type a message...'
          w='100%'
          autosize
          size='md'
          minRows={1}
          rightSection={
            <ActionIcon variant='subtle' color='gray'>
              <IconSend />
            </ActionIcon>
          }
        />
      </Group>
    </Stack>
  );
};
