import { ActionIcon, Group, Textarea } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { forwardRef } from 'react';
import type { GroupProps } from '@mantine/core';

export const ChatForm = forwardRef<HTMLDivElement, GroupProps>((props, ref) => {
  return (
    <Group wrap='nowrap' ref={ref} {...props}>
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
  );
});
ChatForm.displayName = 'ChatForm';
