import { models } from '@local/shared';
import { Box, Center, Group, Select, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useElementSize, useScrollIntoView, useTimeout } from '@mantine/hooks';
import { useSearchParams } from '@remix-run/react';
import { arrayUnion } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader } from '~/components/elements/Loader';
import { useAuth } from '~/hooks/firebase/useAuth';
import { useDocumentData } from '~/hooks/firebase/useDocumentData';
import { useDeepCompareEffect } from '~/hooks/react-use';
import { createThreadAndContent } from '~/models/thread';
import { threadContentRef as _threadContentRef, updateThreadContent } from '~/models/threadContent';
import { geminiPro, openai } from '~/utils/firebase/functions';
import { notify } from '~/utils/mantine/notifications';
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
  const { ref: headRef, height: headHeight } = useElementSize();
  const { ref: formRef, height: formHeight } = useElementSize();
  const scrollAreaHeight = height - headHeight - formHeight - FORM_MARGIN * 2;
  const threadContentRef = useMemo(() => _threadContentRef({ id: threadId }), [threadId]);
  const { data: threadContent } = useDocumentData(threadContentRef);
  const isNewThread = !threadContent?.uid;
  const form = useForm<FormValues>({ initialValues: { model: 'gemini-pro', text: '' } });
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<HTMLDivElement, HTMLDivElement>();
  const { start: startScroll } = useTimeout(() => scrollIntoView(), 100);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = useCallback(
    async ({ model, text }: FormValues) => {
      try {
        setSubmitting(true);
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
          await updateThreadContent({ id: threadContentRef.id, data: { model, messages: arrayUnion(newMessage) } });
        }
        form.setValues({ text: '' });
        const newMessages = [...(threadContent?.messages ?? []), newMessage];
        switch (model) {
          case 'gemini-pro':
            await geminiPro({ threadId: threadContentRef.id, model, messages: newMessages });
            break;
          case 'gpt-3.5-turbo':
          case 'gpt-4-turbo':
            await openai({ threadId: threadContentRef.id, model, messages: newMessages });
            break;
          default:
            notify.error({ message: 'Model not found' });
        }
      } catch (error) {
        console.error(error);
        notify.error({ message: 'Response failed' });
      } finally {
        setSubmitting(false);
      }
    },
    [isNewThread, form, threadContent?.messages, uid, threadContentRef, setSearchParams],
  );

  useDeepCompareEffect(() => {
    startScroll();
  }, [threadContent?.messages, startScroll]);

  useEffect(() => {
    if (threadContent?.model) {
      form.setValues({ model: threadContent.model });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadContent?.model]);

  return (
    <Box h={height}>
      <Group justify='center' ref={headRef}>
        <Select variant='unstyled' data={models} {...form.getInputProps('model')} />
      </Group>
      <Stack gap={0} justify='space-between'>
        <Box h={scrollAreaHeight} className={classes.messages} ref={scrollableRef}>
          {threadContent?.messages.map((message, index) => <ChatMessage key={index} message={message} />)}
          {submitting && (
            <Center>
              <Loader />
            </Center>
          )}
          <div ref={targetRef} />
        </Box>
        <form>
          <ChatForm m={FORM_MARGIN} ref={formRef} form={form} onSend={form.onSubmit(handleSubmit)} />
        </form>
      </Stack>
    </Box>
  );
};
