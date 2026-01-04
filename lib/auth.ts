import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logout = async () => {
  document.cookie =
    "firebase-auth=; Max-Age=0; path=/";
  await signOut(auth);
};

