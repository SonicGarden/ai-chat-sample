import { Box, Stack } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { ChatForm } from './ChatForm';
import { ChatMessage } from './ChatMessage';
import classes from './_styles/Chat.module.css';

const FORM_MARGIN = 32;

export const Chat = ({ height }: { height: number }) => {
  const { ref: formRef, height: formHeight } = useElementSize();
  const scrollAreaHeight = height - formHeight - FORM_MARGIN * 2;

  return (
    <Stack gap={0} justify='space-between'>
      <Box h={scrollAreaHeight} className={classes.messages}>
        {[...new Array(20)].map((_, index) => (
          <ChatMessage
            key={index}
            message={{
              role: index % 2 === 0 ? 'ai' : 'human',
              contents: [
                { type: 'text', value: 'Message1' },
                { type: 'text', value: 'Message2' },
              ],
            }}
          />
        ))}
      </Box>
      <ChatForm m={FORM_MARGIN} ref={formRef} />
    </Stack>
  );
};
