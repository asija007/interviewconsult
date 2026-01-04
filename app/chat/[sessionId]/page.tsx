// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   doc,
//   getDoc,
//   deleteDoc,
//   onSnapshot,
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";
// import { listenToMessages, sendMessage } from "@/lib/chat";
// import { useAuth } from "@/lib/useAuth";

// export default function ChatPage() {
//   const { sessionId } = useParams<{ sessionId: string }>();
//   const router = useRouter();
//   const { user } = useAuth();

//   const [messages, setMessages] = useState<any[]>([]);
//   const [text, setText] = useState("");
//   const [expiresAt, setExpiresAt] = useState<number | null>(null);
//   const [timeLeft, setTimeLeft] = useState<number>(0);
//   const [sessionEnded, setSessionEnded] = useState(false);

//   /**
//    * 1️⃣ Watch session document (detect delete or expiry)
//    */
//   useEffect(() => {
//     if (!sessionId || !user) return;

//     const sessionRef = doc(db, "mentoringSessions", sessionId);

//     const unsub = onSnapshot(sessionRef, (snap) => {
//       // 🔴 Session deleted → exit chat
//       if (!snap.exists()) {
//         setSessionEnded(true);
//         router.replace("/intent");
//         return;
//       }

//       const data = snap.data();

//       // 🔒 Access control
//       if (
//         data.mentorId !== user.uid &&
//         data.menteeId !== user.uid
//       ) {
//         router.replace("/intent");
//         return;
//       }

//       setExpiresAt(data.expiresAt);
//     });

//     return () => unsub();
//   }, [sessionId, user, router]);

//   /**
//    * 2️⃣ Listen to messages
//    */
//   useEffect(() => {
//     if (!sessionId) return;
//     return listenToMessages(sessionId, setMessages);
//   }, [sessionId]);

//   /**
//    * 3️⃣ Timer (15 min auto-end)
//    */
//   useEffect(() => {
//     if (!expiresAt || sessionEnded || !sessionId) return;

//     const interval = setInterval(async () => {
//       const remaining = Math.max(
//         0,
//         Math.floor((expiresAt - Date.now()) / 1000)
//       );
//       setTimeLeft(remaining);

//       if (remaining === 0) {
//         setSessionEnded(true);

//         // 🔥 Auto-kill session
//         await deleteDoc(
//           doc(db, "mentoringSessions", sessionId)
//         );

//         clearInterval(interval);
//         router.replace("/intent");
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [expiresAt, sessionEnded, sessionId, router]);

//   /**
//    * 4️⃣ Explicit End Session (manual kill)
//    */
//   const handleEndSession = async () => {
//     if (!sessionId) return;

//     setSessionEnded(true);

//     await deleteDoc(
//       doc(db, "mentoringSessions", sessionId)
//     );

//     router.replace("/intent");
//   };

//   /**
//    * 5️⃣ Send message
//    */
//   const handleSend = async () => {
//     if (!text.trim() || sessionEnded || !user) return;

//     await sendMessage(sessionId, user.uid, text);
//     setText("");
//   };

//   if (!expiresAt && !sessionEnded) {
//     return <p className="p-6">Loading session…</p>;
//   }

//   return (
//     <div className="flex h-screen flex-col bg-gray-50">
//       {/* Header */}
//       <div className="border-b bg-white p-4 flex justify-between items-center">
//         <div>
//           <h1 className="font-semibold">Mentoring Session</h1>
//           <p className="text-xs text-gray-500">
//             Session ID: {sessionId}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           {!sessionEnded && (
//             <span className="text-sm text-gray-600">
//               ⏱ {Math.floor(timeLeft / 60)}:
//               {String(timeLeft % 60).padStart(2, "0")}
//             </span>
//           )}

//           {!sessionEnded && (
//             <button
//               onClick={handleEndSession}
//               className="rounded bg-red-600 px-3 py-1 text-sm text-white"
//             >
//               End Session
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`max-w-[70%] rounded p-2 ${
//               msg.senderId === user?.uid
//                 ? "ml-auto bg-black text-white"
//                 : "mr-auto bg-white border"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <div className="border-t bg-white p-4 flex gap-2">
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           disabled={sessionEnded}
//           className="flex-1 border rounded px-3 py-2 disabled:bg-gray-100"
//           placeholder={
//             sessionEnded
//               ? "Session ended"
//               : "Type your message…"
//           }
//         />
//         <button
//           onClick={handleSend}
//           disabled={sessionEnded}
//           className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { listenToMessages, sendMessage } from "@/lib/chat";
import { useAuth } from "@/lib/useAuth";

export default function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [sessionEnded, setSessionEnded] = useState(false);

  /* 1️⃣ Watch session */
  useEffect(() => {
    if (!sessionId || !user) return;

    const ref = doc(db, "mentoringSessions", sessionId);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setSessionEnded(true);
        router.replace("/intent");
        return;
      }

      const data = snap.data();
      if (
        data.mentorId !== user.uid &&
        data.menteeId !== user.uid
      ) {
        router.replace("/intent");
        return;
      }

      setExpiresAt(data.expiresAt);
    });

    return () => unsub();
  }, [sessionId, user, router]);

  /* 2️⃣ Messages */
  useEffect(() => {
    if (!sessionId) return;
    return listenToMessages(sessionId, setMessages);
  }, [sessionId]);

  /* 3️⃣ Timer */
  useEffect(() => {
    if (!expiresAt || sessionEnded) return;

    const interval = setInterval(async () => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining === 0) {
        setSessionEnded(true);
        await deleteDoc(
          doc(db, "mentoringSessions", sessionId)
        );
        router.replace("/intent");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, sessionEnded, sessionId, router]);

  const handleSend = async () => {
    if (!text.trim() || sessionEnded || !user) return;
    await sendMessage(sessionId, user.uid, text);
    setText("");
  };

  const handleEndSession = async () => {
    setSessionEnded(true);
    await deleteDoc(
      doc(db, "mentoringSessions", sessionId)
    );
    router.replace("/intent");
  };

  if (!expiresAt && !sessionEnded) {
    return <p className="p-6">Loading session…</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-12">
        {/* CHAT PANEL */}
        <div className="md:col-span-7 flex flex-col rounded-xl border bg-white shadow-sm">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Mentoring Session
              </h2>
              <p className="text-xs text-gray-500">
                Live 1:1 conversation
              </p>
            </div>

            <div className="flex items-center gap-4">
              {!sessionEnded && (
                <span className="text-sm text-gray-600">
                  ⏱ {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              )}

              {!sessionEnded && (
                <button
                  onClick={handleEndSession}
                  className="rounded-md bg-red-600 px-3 py-1 text-sm text-white"
                >
                  End
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
                  msg.senderId === user?.uid
                    ? "ml-auto bg-black text-white"
                    : "mr-auto bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t px-4 py-3 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={sessionEnded}
              className="flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
              placeholder={
                sessionEnded
                  ? "Session ended"
                  : "Type your message…"
              }
            />
            <button
              onClick={handleSend}
              disabled={sessionEnded}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold">
              Session agenda
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Introductions (1–2 mins)</li>
              <li>• Interview questions discussion</li>
              <li>• Project explanation feedback</li>
              <li>• Closing tips & next steps</li>
            </ul>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold">
              Make the most of this session
            </h3>
            <p className="text-sm text-gray-600">
              Be specific with your questions. Focus on real
              interview scenarios and clarity in explanation.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-2 font-semibold">
              Session status
            </h3>
            <p className="text-sm text-gray-600">
              {sessionEnded
                ? "This session has ended."
                : "Live · Private · Auto-ends after 15 minutes"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { useAuth } from "@/lib/useAuth";
// import { listenToMessages, sendMessage } from "@/lib/chat";

// export default function ChatPage() {
//   const { sessionId } = useParams<{ sessionId: string }>();
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   const [messages, setMessages] = useState<any[]>([]);
//   const [text, setText] = useState("");
//   const [expiresAt, setExpiresAt] = useState<number | null>(null);
//   const [timeLeft, setTimeLeft] = useState(0);

//   /* 1️⃣ Validate session */
//   useEffect(() => {
//     if (!user) return;

//     const loadSession = async () => {
//       const snap = await getDoc(
//         doc(db, "mentoringSessions", sessionId)
//       );

//       if (!snap.exists()) {
//         router.replace("/dashboard");
//         return;
//       }

//       const data = snap.data();
//       if (
//         data.mentorId !== user.uid &&
//         data.menteeId !== user.uid
//       ) {
//         router.replace("/dashboard");
//         return;
//       }

//       setExpiresAt(data.expiresAt);
//     };

//     loadSession();
//   }, [sessionId, user, router]);

//   /* 2️⃣ Listen to messages */
//   useEffect(() => {
//     if (!sessionId) return;
//     return listenToMessages(sessionId, setMessages);
//   }, [sessionId]);

//   /* 3️⃣ Timer */
//   useEffect(() => {
//     if (!expiresAt) return;

//     const interval = setInterval(() => {
//       const remaining = Math.max(
//         0,
//         Math.floor((expiresAt - Date.now()) / 1000)
//       );
//       setTimeLeft(remaining);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [expiresAt]);

//   if (loading || !user || expiresAt === null) {
//     return <p className="p-6">Loading chat…</p>;
//   }

//   const sessionEnded = timeLeft <= 0;

//   const handleSend = async () => {
//     if (!text.trim()) return;
//     await sendMessage(sessionId, user.uid, text);
//     setText("");
//   };

//   return (
//     <div className="flex h-[calc(100vh-64px)] flex-col md:flex-row bg-gray-50">
      
//       {/* 💬 CHAT SECTION */}
//       <div className="flex flex-col w-full md:w-1/2 border-r bg-white">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-4 py-3">
//           <h1 className="font-semibold">Mentoring Chat</h1>
//           <span className="text-sm text-gray-600">
//             {sessionEnded
//               ? "Session ended"
//               : `⏱ ${Math.floor(timeLeft / 60)}:${String(
//                   timeLeft % 60
//                 ).padStart(2, "0")}`}
//           </span>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
//                 msg.senderId === user.uid
//                   ? "ml-auto bg-black text-white"
//                   : "mr-auto bg-gray-200"
//               }`}
//             >
//               {msg.text}
//             </div>
//           ))}
//         </div>

//         {/* Input */}
//         <div className="border-t px-4 py-3 flex gap-2">
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             disabled={sessionEnded}
//             className="flex-1 rounded border px-3 py-2 focus:outline-none"
//             placeholder={
//               sessionEnded
//                 ? "Session ended"
//                 : "Type your message…"
//             }
//           />
//           <button
//             onClick={handleSend}
//             disabled={sessionEnded}
//             className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
//           >
//             Send
//           </button>
//         </div>
//       </div>

//       {/* 📘 SIDE PANEL (DESKTOP ONLY) */}
//       <div className="hidden md:flex w-1/2 flex-col p-6 space-y-6">
//         <div className="rounded-lg bg-white p-4 shadow-sm">
//           <h2 className="font-semibold mb-2">
//             How to use this session
//           </h2>
//           <ul className="text-sm text-gray-600 space-y-2">
//             <li>• Discuss interview questions</li>
//             <li>• Ask for real feedback</li>
//             <li>• Share past interview experience</li>
//             <li>• Clarify doubts quickly</li>
//           </ul>
//         </div>

//         <div className="rounded-lg bg-white p-4 shadow-sm">
//           <h2 className="font-semibold mb-2">
//             Session rules
//           </h2>
//           <p className="text-sm text-gray-600">
//             This is a 15-minute focused discussion. Please
//             be respectful and stay on topic.
//           </p>
//         </div>

//         {sessionEnded && (
//           <button
//             onClick={() => router.push("/payment")}
//             className="rounded bg-black px-4 py-2 text-white"
//           >
//             Start New Session
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
