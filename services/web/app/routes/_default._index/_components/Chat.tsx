import { Box, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useElementSize, useScrollIntoView, useTimeout } from '@mantine/hooks';
import { useSearchParams } from '@remix-run/react';
import { arrayUnion } from 'firebase/firestore';
import { useCallback, useMemo } from 'react';
import { useAuth } from '~/hooks/firebase/useAuth';
import { useDocumentData } from '~/hooks/firebase/useDocumentData';
import { useDeepCompareEffect } from '~/hooks/react-use';
import { createThreadAndContent } from '~/models/thread';
import { threadContentRef as _threadContentRef, updateThreadContent } from '~/models/threadContent';
import { ChatForm } from './ChatForm';
import { ChatMessage } from './ChatMessage';
import classes from './_styles/Chat.module.css';
import type { Message, ThreadContent } from '@local/shared';

const FORM_MARGIN = 32;

export type FormValues = {
  model: ThreadContent['model'];
  text: string;
};

export const Chat = ({ height }: { height: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const threadId = searchParams.get('threadId');
  const { user } = useAuth();
  const uid = user!.uid;
  const { ref: formRef, height: formHeight } = useElementSize();
  const scrollAreaHeight = height - formHeight - FORM_MARGIN * 2;
  const threadContentRef = useMemo(() => _threadContentRef({ id: threadId }), [threadId]);
  const { data: threadContent } = useDocumentData(threadContentRef);
  const isNewThread = !threadContent?.uid;
  const form = useForm<FormValues>({ initialValues: { model: 'gemini-pro', text: '' } });
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<HTMLDivElement, HTMLDivElement>();
  const { start: startScroll } = useTimeout(() => scrollIntoView(), 100);
  const handleSubmit = useCallback(
    async ({ model, text }: FormValues) => {
      const newMessage: Message = { role: 'human', contents: [{ type: 'text', value: text }] };
      if (isNewThread) {
        await createThreadAndContent({
          id: threadContentRef.id,
          uid,
          title: text.split('\n')[0],
          model,
          messages: [newMessage],
        });
        setSearchParams({ threadId: threadContentRef.id });
      } else {
        await updateThreadContent({ id: threadContentRef.id, data: { messages: arrayUnion(newMessage) } });
      }
      form.setValues({ text: '' });
      // TODO: AIにメッセージを送信
    },
    [isNewThread, form, uid, threadContentRef, setSearchParams],
  );

  useDeepCompareEffect(() => {
    startScroll();
  }, [threadContent?.messages, startScroll]);

  return (
    <Stack gap={0} justify='space-between'>
      <Box h={scrollAreaHeight} className={classes.messages} ref={scrollableRef}>
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
        <div ref={targetRef} />
      </Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <ChatForm m={FORM_MARGIN} ref={formRef} form={form} />
      </form>
    </Stack>
  );
};
