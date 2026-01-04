// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   setDoc,
//   where,
//   deleteDoc
// } from "firebase/firestore";
// import { db } from "./firebase";

// export const joinMatchingQueue = async (
//   uid: string,
//   intent: "mentor" | "mentee",
//   company: string
// ) => {
//   await setDoc(doc(db, "matchingQueue", uid), {
//     uid,
//     intent,
//     company,
//     joinedAt: Date.now(),
//   });
// };

// export const tryMatchUser = async (
//   uid: string,
//   intent: "mentor" | "mentee",
//   company: string
// ) => {
//   const oppositeIntent = intent === "mentor" ? "mentee" : "mentor";

//   const q = query(
//     collection(db, "matchingQueue"),
//     where("intent", "==", oppositeIntent),
//     where("company", "==", company)
//   );

//   const snapshot = await getDocs(q);

//   if (snapshot.empty) return null;

//   const matchedUser = snapshot.docs[0].data();
//  const sessionId = [uid, matchedUser.uid].sort().join("_");


//   const mentorId = intent === "mentor" ? uid : matchedUser.uid;
//   const menteeId = intent === "mentee" ? uid : matchedUser.uid;

//   await setDoc(doc(db, "mentoringSessions", sessionId), {
//     mentorId,
//     menteeId,
//     company,
//     startedAt: Date.now(),
//     expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
//     active: true,
//   });

//   // Remove both users from queue
//   await deleteDoc(doc(db, "matchingQueue", uid));
//   await deleteDoc(doc(db, "matchingQueue", matchedUser.uid));

//   return sessionId;
// };


// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   setDoc,
//   where,
//   deleteDoc,
//   addDoc,
// } from "firebase/firestore";
// import { db } from "./firebase";

// export const joinMatchingQueue = async (
//   uid: string,
//   intent: "mentor" | "mentee",
//   company: string
// ) => {
//   await setDoc(doc(db, "matchingQueue", uid), {
//     uid,
//     intent,
//     company,
//     joinedAt: Date.now(),
//   });
// };

// export const tryMatchUser = async (
//   uid: string,
//   intent: "mentor" | "mentee",
//   company: string
// ) => {
//   const oppositeIntent = intent === "mentor" ? "mentee" : "mentor";

//   const q = query(
//     collection(db, "matchingQueue"),
//     where("intent", "==", oppositeIntent),
//     where("company", "==", company)
//   );

//   const snapshot = await getDocs(q);
//   if (snapshot.empty) return null;

//   const matchedUser = snapshot.docs[0].data();

//   const mentorId = intent === "mentor" ? uid : matchedUser.uid;
//   const menteeId = intent === "mentee" ? uid : matchedUser.uid;

//   // ✅ NEW: create a brand-new session every time
//   const sessionRef = await addDoc(
//     collection(db, "mentoringSessions"),
//     {
//       mentorId,
//       menteeId,
//       company,
//       startedAt: Date.now(),
//       expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
//       active: true,
//     }
//   );

//   const sessionId = sessionRef.id;

//   // Remove both users from queue
//   await deleteDoc(doc(db, "matchingQueue", uid));
//   await deleteDoc(doc(db, "matchingQueue", matchedUser.uid));

//   return sessionId;
// };



import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const joinMatchingQueue = async (
  uid: string,
  intent: "mentor" | "mentee",
  company: string,
  skills?: string[]   // optional
) => {
  await setDoc(doc(db, "matchingQueue", uid), {
    uid,
    intent,
    company,
    skills: skills ?? [],   // ✅ NEVER undefined
    joinedAt: Date.now(),
  });
};



export const tryMatchUser = async (
  uid: string,
  intent: "mentor" | "mentee",
  company: string,
  skills: string[]
) => {
  const oppositeIntent =
    intent === "mentor" ? "mentee" : "mentor";

  // 🔥 Base filters
  const filters: any[] = [
    where("intent", "==", oppositeIntent),
    where("company", "==", company),
  ];

  // 🔥 Apply skill filter ONLY if skills exist
  if (skills && skills.length > 0) {
    filters.push(
      where("skills", "array-contains-any", skills)
    );
  }

  const q = query(
    collection(db, "matchingQueue"),
    ...filters
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const matchedUser = snapshot.docs[0].data();

  const mentorId =
    intent === "mentor" ? uid : matchedUser.uid;

  const menteeId =
    intent === "mentee" ? uid : matchedUser.uid;

  const sessionRef = await addDoc(
    collection(db, "mentoringSessions"),
    {
      mentorId,
      menteeId,
      company,
      skillsMatched: skills ?? [],
      startedAt: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000,
      active: true,
    }
  );

  // Remove both users from queue
  await deleteDoc(doc(db, "matchingQueue", uid));
  await deleteDoc(doc(db, "matchingQueue", matchedUser.uid));

  return sessionRef.id;
};


