import { ActionIcon, Group, Textarea } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { forwardRef } from 'react';
import type { FormValues } from './Chat';
import type { GroupProps } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

type Props = GroupProps & {
  form: UseFormReturnType<FormValues>;
};

export const ChatForm = forwardRef<HTMLDivElement, Props>(({ form, ...props }, ref) => {
  return (
    <Group wrap='nowrap' ref={ref} {...props}>
      <Textarea
        placeholder='Type a message...'
        w='100%'
        autosize
        size='md'
        minRows={1}
        rightSection={
          <ActionIcon variant='subtle' color='gray' type='submit' disabled={!form.values.text}>
            <IconSend />
          </ActionIcon>
        }
        {...form.getInputProps('text')}
      />
    </Group>
  );
});
ChatForm.displayName = 'ChatForm';
