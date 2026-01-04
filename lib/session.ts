import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserIntent } from "../app/types/intent";

export const setUserIntent = async (
  uid: string,
  intent: UserIntent
) => {
  await setDoc(
    doc(db, "sessions", uid),
    {
      intent,
      createdAt: Date.now(),
    },
    { merge: true }
  );
};

export const setSessionCompany = async (
  uid: string,
  company: string
) => {
  await setDoc(
    doc(db, "sessions", uid),
    {
      company,
    },
    { merge: true }
  );
};
