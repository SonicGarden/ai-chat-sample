import { Center, Title } from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'AI Chat Firebase' }, { name: 'description', content: 'Welcome to AI Chat Firebase!' }];
};

export default function Index() {
  return (
    <Center p='lg'>
      <Title>Hello Mantine!</Title>
    </Center>
  );
}
