import { Card, Group, Box, Stack } from '@mantine/core';
import { IconRobot, IconUser } from '@tabler/icons-react';
import Markdown from 'react-markdown';
import classes from './_styles/ChatMessage.module.css';
import type { Message } from '@local/shared';

export const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <Card radius={0} {...(message.role === 'ai' && { bg: 'dark.4' })} py={0}>
      <Group align='top' wrap='nowrap'>
        <Box py='md'>{message.role === 'ai' ? <IconRobot /> : <IconUser />}</Box>
        <Stack gap={0} className={classes.contents}>
          {message.contents.map((content, index) => (
            <Box key={index}>
              <Markdown>{content.value}</Markdown>
            </Box>
          ))}
        </Stack>
      </Group>
    </Card>
  );
};
