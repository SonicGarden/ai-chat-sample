import { Center } from '@mantine/core';
import { Loader } from '~/components/elements/Loader';

export const LoadingScreen = () => {
  return (
    <Center p='lg'>
      <Loader />
    </Center>
  );
};
