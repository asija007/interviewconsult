import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "../app/types/user";

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const createUserProfile = async (profile: UserProfile) => {
  const ref = doc(db, "users", profile.uid);
  await setDoc(ref, profile);
};
