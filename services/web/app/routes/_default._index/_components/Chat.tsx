import { Box, Stack } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useSearchParams } from '@remix-run/react';
import { useMemo } from 'react';
import { useDocumentData } from '~/hooks/firebase/useDocumentData';
import { threadContentRef as _threadContentRef } from '~/models/threadContent';
import { ChatForm } from './ChatForm';
import { ChatMessage } from './ChatMessage';
import classes from './_styles/Chat.module.css';

const FORM_MARGIN = 32;

export const Chat = ({ height }: { height: number }) => {
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get('threadId');
  const { ref: formRef, height: formHeight } = useElementSize();
  const scrollAreaHeight = height - formHeight - FORM_MARGIN * 2;
  const threadContentRef = useMemo(() => _threadContentRef({ id: threadId }), [threadId]);
  const { data: threadContent } = useDocumentData(threadContentRef);

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
        {threadContent?.messages.map((message, index) => <ChatMessage key={index} message={message} />)}
      </Box>
      <ChatForm m={FORM_MARGIN} ref={formRef} />
    </Stack>
  );
};
