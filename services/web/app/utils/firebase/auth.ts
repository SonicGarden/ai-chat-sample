import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getAuth(), provider);
};

export { signInWithGoogle };
