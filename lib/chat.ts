import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

export const sendMessage = async (
  sessionId: string,
  senderId: string,
  text: string
) => {
  await addDoc(
    collection(db, "messages", sessionId, "chat"),
    {
      senderId,
      text,
      createdAt: Date.now(),
    }
  );
};

export const listenToMessages = (
  sessionId: string,
  callback: (messages: any[]) => void
) => {
  const q = query(
    collection(db, "messages", sessionId, "chat"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(msgs);
  });
};
