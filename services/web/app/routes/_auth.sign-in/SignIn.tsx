import { Center } from '@mantine/core';
import { SignInWithGoogleForm } from '~/components/forms/auth/SignInWithGoogleForm';

export const SignIn = () => {
  return (
    <Center py='lg'>
      <SignInWithGoogleForm />
    </Center>
  );
};
