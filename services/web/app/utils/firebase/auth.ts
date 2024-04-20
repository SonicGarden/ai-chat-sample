import { getAuth, signOut as _signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getAuth(), provider);
};

const signOut = async () => _signOut(getAuth());

export { signInWithGoogle, signOut };
