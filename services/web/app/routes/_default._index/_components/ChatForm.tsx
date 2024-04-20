import { ActionIcon, Group, Textarea } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { IconSend } from '@tabler/icons-react';
import { forwardRef } from 'react';
import type { FormValues } from './Chat';
import type { GroupProps } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

type Props = GroupProps & {
  form: UseFormReturnType<FormValues>;
  onSend: () => void;
};

export const ChatForm = forwardRef<HTMLDivElement, Props>(({ form, onSend, ...props }, ref) => {
  return (
    <Group wrap='nowrap' ref={ref} {...props}>
      <Textarea
        placeholder='Type a message...'
        w='100%'
        autosize
        size='md'
        minRows={1}
        rightSection={
          <ActionIcon variant='subtle' color='gray' onClick={onSend} disabled={!form.values.text}>
            <IconSend />
          </ActionIcon>
        }
        onKeyDown={getHotkeyHandler([['shift+enter', onSend]])}
        {...form.getInputProps('text')}
      />
    </Group>
  );
});
ChatForm.displayName = 'ChatForm';
