// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   onSnapshot
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";
// import { useAuth } from "@/lib/useAuth";
// import { joinMatchingQueue, tryMatchUser } from "@/lib/matching";

// export default function PaymentPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   const [intent, setIntent] = useState<"mentor" | "mentee" | null>(null);
//   const [company, setCompany] = useState<string | null>(null);
//   const [matching, setMatching] = useState(false);


// useEffect(() => {
//   if (!user) return;

//   const fetchSession = async () => {
//     const snap = await getDoc(doc(db, "sessions", user.uid));

//     if (!snap.exists()) {
//       router.replace("/intent");
//       return;
//     }

//     const data = snap.data();

//     console.log("Session data:", data); // DEBUG (remove later)

//     setIntent(data.intent ?? null);
//     setCompany(data.company ?? null);
//   };

//   fetchSession();
// }, [user, router]);



//   useEffect(() => {
//   if (!user) return;

//   const q = query(
//     collection(db, "mentoringSessions"),
//     where("mentorId", "==", user.uid)
//   );

//   const q2 = query(
//     collection(db, "mentoringSessions"),
//     where("menteeId", "==", user.uid)
//   );

//   const unsub1 = onSnapshot(q, (snap) => {
//     if (!snap.empty) {
//       router.push(`/chat/${snap.docs[0].id}`);
//     }
//   });

//   const unsub2 = onSnapshot(q2, (snap) => {
//     if (!snap.empty) {
//       router.push(`/chat/${snap.docs[0].id}`);
//     }
//   });

//   return () => {
//     unsub1();
//     unsub2();
//   };
// }, [user, router]);


//   useEffect(() => {
//     const fetchSession = async () => {
//       if (!user) return;

//       const snap = await getDoc(doc(db, "sessions", user.uid));
//       if (snap.exists()) {
//         setIntent(snap.data().intent);
//         setCompany(snap.data().company);
//       }
//     };

//     fetchSession();
//   }, [user]);

//   if (loading) {
//   return <p>Loading...</p>;
// }

// if (!intent || !company) {
//   return (
//     <div className="p-6">
//       <p>Session not ready. Redirecting...</p>
//     </div>
//   );
// }


//   const handleStart = async () => {
//     setMatching(true);

//     await joinMatchingQueue(user!.uid, intent, company);

//     const interval = setInterval(async () => {
//       const sessionId = await tryMatchUser(
//         user!.uid,
//         intent,
//         company
//       );

//       if (sessionId) {
//         clearInterval(interval);
//         router.push(`/chat/${sessionId}`);
//       }
//     }, 2000); // try every 2 seconds
//   };

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="w-[420px] space-y-4 rounded border p-6 text-center">
//         <h1 className="text-xl font-semibold">
//           {intent === "mentor"
//             ? "You will earn ₹500 per session"
//             : "This session costs ₹500"}
//         </h1>

//         <p className="text-sm text-gray-600">
//           Free during beta · 15 minute session
//         </p>

//         <button
//           disabled={matching}
//           onClick={handleStart}
//           className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
//         >
//           {matching ? "Finding a match..." : "Start Free Session"}
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { doc, getDoc, addDoc, collection } from "firebase/firestore";

// import { db } from "@/lib/firebase";
// import { useAuth } from "@/lib/useAuth";

// export default function PaymentPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   const [company, setCompany] = useState<string | null>(null);
//   const [starting, setStarting] = useState(false);

//   // 1️⃣ Load user profile (from signup + prepare data)
//   useEffect(() => {
//     if (!user) return;

//     const fetchUserProfile = async () => {
//       const snap = await getDoc(doc(db, "users", user.uid));

//       if (!snap.exists()) {
//         router.replace("/prepare");
//         return;
//       }

//       const data = snap.data();

//       // pick first target company
//       const targetCompanies: string[] =
//         data.targetCompanies || [];

//       setCompany(targetCompanies[0] || "General Interview");
//     };

//     fetchUserProfile();
//   }, [user, router]);

//   if (loading || !company) {
//     return <p className="p-6">Loading payment details…</p>;
//   }

//   // 2️⃣ Start session directly
//   const handleStartSession = async () => {
//     if (!user) return;

//     setStarting(true);

//     const sessionRef = await addDoc(
//       collection(db, "mentoringSessions"),
//       {
//         menteeId: user.uid,
//         company,
//         createdAt: Date.now(),
//         expiresAt: Date.now() + 15 * 60 * 1000,
//       }
//     );

//     router.push(`/chat/${sessionRef.id}`);
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-50">
//       <div className="w-[420px] space-y-4 rounded-lg border bg-white p-6 text-center">
//         <h1 className="text-xl font-semibold">
//           Interview Session · {company}
//         </h1>

//         <p className="text-sm text-gray-600">
//           15-minute focused 1:1 interview discussion
//         </p>

//         <div className="my-4 text-3xl font-bold">
//           ₹500 <span className="text-base font-normal">/ session</span>
//         </div>

//         <p className="text-xs text-gray-500">
//           Free during beta · No payment required now
//         </p>

//         <button
//           disabled={starting}
//           onClick={handleStartSession}
//           className="mt-4 w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
//         >
//           {starting ? "Starting session…" : "Start Free Session"}
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";
// import { useAuth } from "@/lib/useAuth";
// import { joinMatchingQueue, tryMatchUser } from "@/lib/matching";

// export default function PaymentPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // 🔑 NEW: intent is implicit
//   const intent: "mentee" = "mentee";

//   const [company, setCompany] = useState<string | null>(null);
//   const [matching, setMatching] = useState(false);

//   // 1️⃣ Load company from user profile (Prepare page data)
//   useEffect(() => {
//     if (!user) return;

//     const loadProfile = async () => {
//       const snap = await getDoc(doc(db, "users", user.uid));

//       if (!snap.exists()) {
//         router.replace("/prepare");
//         return;
//       }

//       const data = snap.data();
//       const targetCompanies: string[] =
//         data.targetCompanies || [];

//       setCompany(targetCompanies[0] || "General Mentoring");
//     };

//     loadProfile();
//   }, [user, router]);

//   // 2️⃣ Listen for session creation (mentor joins OR mentee joins)
//   useEffect(() => {
//     if (!user) return;

//     const q1 = query(
//       collection(db, "mentoringSessions"),
//       where("mentorId", "==", user.uid)
//     );

//     const q2 = query(
//       collection(db, "mentoringSessions"),
//       where("menteeId", "==", user.uid)
//     );

//     const unsub1 = onSnapshot(q1, (snap) => {
//       if (!snap.empty) {
//         router.push(`/chat/${snap.docs[0].id}`);
//       }
//     });

//     const unsub2 = onSnapshot(q2, (snap) => {
//       if (!snap.empty) {
//         router.push(`/chat/${snap.docs[0].id}`);
//       }
//     });

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, [user, router]);

//   if (loading || !company) {
//     return <p className="p-6">Loading payment…</p>;
//   }

//   // 3️⃣ Join matching queue (EXACTLY like old flow)
//   const handleStart = async () => {
//     if (!user) return;

//     setMatching(true);

//     await joinMatchingQueue(user.uid, intent, company);

//     const interval = setInterval(async () => {
//       const sessionId = await tryMatchUser(
//         user.uid,
//         intent,
//         company
//       );

//       if (sessionId) {
//         clearInterval(interval);
//         router.push(`/chat/${sessionId}`);
//       }
//     }, 2000);
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-50">
//       <div className="w-[420px] space-y-4 rounded border bg-white p-6 text-center">
//         <h1 className="text-xl font-semibold">
//           Interview Session · {company}
//         </h1>

//         <p className="text-sm text-gray-600">
//           1:1 mentoring · 15 minutes
//         </p>

//         <div className="my-4 text-3xl font-bold">
//           ₹500{" "}
//           <span className="text-base font-normal">
//             / session
//           </span>
//         </div>

//         <p className="text-xs text-gray-500">
//           Free during beta · No payment required
//         </p>

//         <button
//           disabled={matching}
//           onClick={handleStart}
//           className="mt-4 w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
//         >
//           {matching
//             ? "Finding a match…"
//             : "Start Free Session"}
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";

// import { db } from "@/lib/firebase";
// import { useAuth } from "@/lib/useAuth";
// import { joinMatchingQueue, tryMatchUser } from "@/lib/matching";

// export default function PaymentPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   const [intent, setIntent] = useState<"mentor" | "mentee" | null>(null);
//   const [company, setCompany] = useState<string | null>(null);
//   const [matching, setMatching] = useState(false);

//   1️⃣ Load role + company from user profile
//   useEffect(() => {
//     if (!user) return;

//     const loadProfile = async () => {
//       const snap = await getDoc(doc(db, "users", user.uid));

//       if (!snap.exists()) {
//         router.replace("/prepare");
//         return;
//       }

//       const data = snap.data();

//       const role: "mentor" | "mentee" =
//         data.role === "mentor" ? "mentor" : "mentee";
//       setIntent(role);

//       if (role === "mentor") {
//         setCompany(
//           data.mentorCompanies?.[0] || "General Mentoring"
//         );
//       } else {
//         setCompany(
//           data.targetCompanies?.[0] || "General Mentoring"
//         );
//       }
//     };

//     loadProfile();
//   }, [user, router]);

//   2️⃣ Listen for session creation (either side)
//   useEffect(() => {
//     if (!user) return;

//     const q1 = query(
//       collection(db, "mentoringSessions"),
//       where("mentorId", "==", user.uid)
//     );

//     const q2 = query(
//       collection(db, "mentoringSessions"),
//       where("menteeId", "==", user.uid)
//     );

//     const unsub1 = onSnapshot(q1, (snap) => {
//       if (!snap.empty) {
//         router.push(`/chat/${snap.docs[0].id}`);
//       }
//     });

//     const unsub2 = onSnapshot(q2, (snap) => {
//       if (!snap.empty) {
//         router.push(`/chat/${snap.docs[0].id}`);
//       }
//     });

//     return () => {
//       unsub1();
//       unsub2();
//     };
//   }, [user, router]);

//   if (loading || !intent || !company) {
//     return <p className="p-6">Loading payment…</p>;
//   }

//   3️⃣ Join matching queue (FIXED)
//   const handleStart = async () => {
//     if (!user) return;

//     setMatching(true);

//     await joinMatchingQueue(user.uid, intent, company);

//     const interval = setInterval(async () => {
//       const sessionId = await tryMatchUser(
//         user.uid,
//         intent,
//         company
//       );

//       if (sessionId) {
//         clearInterval(interval);
//         router.push(`/chat/${sessionId}`);
//       }
//     }, 2000);
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-50">
//       <div className="w-[420px] space-y-4 rounded border bg-white p-6 text-center">
//         <h1 className="text-xl font-semibold">
//           {intent === "mentor"
//             ? `Mentoring Session · ${company}`
//             : `Interview Session · ${company}`}
//         </h1>

//         <p className="text-sm text-gray-600">
//           1:1 session · 15 minutes
//         </p>

//         <div className="my-4 text-3xl font-bold">
//           ₹500{" "}
//           <span className="text-base font-normal">
//             / session
//           </span>
//         </div>

//         <p className="text-xs text-gray-500">
//           Free during beta · No payment required
//         </p>

//         <button
//           disabled={matching}
//           onClick={handleStart}
//           className="mt-4 w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
//         >
//           {matching
//             ? "Finding a match…"
//             : "Start Free Session"}
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";

import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { joinMatchingQueue, tryMatchUser } from "@/lib/matching";

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function PaymentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [intent, setIntent] = useState<"mentor" | "mentee" | null>(null);
  const [company, setCompany] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);
  const [queueUsers, setQueueUsers] = useState<any[]>([]);

useEffect(() => {
  if (!user) return;

  const q = collection(db, "matchingQueue");

  const unsubscribe = onSnapshot(q, (snap) => {
    const now = Date.now();

    const list = snap.docs
      .map((doc) => doc.data())
      .filter((u) => u.uid !== user.uid)
      .filter((u) => now - u.joinedAt < 2 * 60 * 1000); // ⏱ last 2 minutes only

    setQueueUsers(list);
  });

  return () => unsubscribe();
}, [user]);


  /* 1️⃣ Load intent + company from session (single source of truth) */
  useEffect(() => {
    if (!user) return;

    const loadSession = async () => {
      const snap = await getDoc(doc(db, "sessions", user.uid));
      if (!snap.exists()) {
        router.replace("/intent");
        return;
      }

      const data = snap.data();
      setIntent(data.intent);
      setCompany(data.company);
    };

    loadSession();
  }, [user, router]);

  /* 2️⃣ Listen for session creation */
  useEffect(() => {
    if (!user) return;

    const q1 = query(
      collection(db, "mentoringSessions"),
      where("mentorId", "==", user.uid)
    );

    const q2 = query(
      collection(db, "mentoringSessions"),
      where("menteeId", "==", user.uid)
    );

    const unsub1 = onSnapshot(q1, (snap) => {
      if (!snap.empty) {
        router.push(`/chat/${snap.docs[0].id}`);
      }
    });

    const unsub2 = onSnapshot(q2, (snap) => {
      if (!snap.empty) {
        router.push(`/chat/${snap.docs[0].id}`);
      }
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [user, router]);

  if (loading || !intent || !company) {
    return <p className="p-6">Loading...</p>;
  }

  /* 3️⃣ Start matching */
  const handleStart = async () => {
    setMatching(true);
    if (!company) {
  alert("Company not selected yet");
  return;
}
    await joinMatchingQueue(user!.uid, intent, company);

    const interval = setInterval(async () => {
      const sessionId = await tryMatchUser(
        user!.uid,
        intent,
        company
      );

      if (sessionId) {
        clearInterval(interval);
        router.push(`/chat/${sessionId}`);
      }
    }, 2000);
  };

  return (
    <>
      <AppHeader />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #eef2f7 100%)",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* LEFT: PAYMENT / MATCHING */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                }}
              >
                <Stack spacing={4} textAlign="center">
                  <Typography variant="h4" fontWeight={700}>
                    {intent === "mentor"
                      ? `Mentor for ${company}`
                      : `Interview prep for ${company}`}
                  </Typography>

                  <Typography color="text.secondary">
                    1:1 live chat · 15 minutes
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight={800}
                  >
                    {intent === "mentor"
                      ? "Earn ₹500"
                      : "₹500"}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Free during beta · No payment required
                  </Typography>

                  {!matching ? (
                    <Button
                      size="large"
                      variant="contained"
                      onClick={handleStart}
                      sx={{
                        py: 1.5,
                        backgroundColor: "black",
                        "&:hover": {
                          backgroundColor: "#222",
                        },
                      }}
                    >
                      Start Free Session
                    </Button>
                  ) : (
                    <Stack spacing={2} alignItems="center">
                      <CircularProgress />
                      <Typography>
                        Finding the best match for you…
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* RIGHT: VALUE + QUEUE FEEL */}
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Typography variant="h4" fontWeight={700}>
                  Why consultation improves your chances
                </Typography>

                <Stack spacing={2}>
                  <Typography>
                    ✅ Candidates who practice with real
                    professionals gain clarity and confidence.
                  </Typography>
                  <Typography>
                    ✅ Learn how to explain projects the way
                    interviewers expect.
                  </Typography>
                  <Typography>
                    ✅ Get honest feedback, not generic advice.
                  </Typography>
                  <Typography>
                    ✅ Understand company-specific expectations.
                  </Typography>
                </Stack>

                {/* FAKE BUT BEAUTIFUL QUEUE ANIMATION */}
               <Paper
  elevation={0}
  sx={{
    p: 3,
    borderRadius: 3,
    border: "1px dashed #d1d5db",
    backgroundColor: "#f9fafb",
  }}
>
  <Typography fontWeight={600} mb={2}>
    Others currently waiting ({queueUsers.length})
  </Typography>

  {queueUsers.length === 0 ? (
    <Typography variant="body2" color="text.secondary">
      No one else is waiting right now. You’ll be matched
      as soon as someone joins.
    </Typography>
  ) : (
    <Stack spacing={1}>
      {queueUsers.slice(0, 5).map((u, idx) => (
        <Box
          key={idx}
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">
            {u.intent === "mentor" ? "🤝 Mentor" : "🎓 Candidate"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {u.company}
          </Typography>
        </Box>
      ))}
    </Stack>
  )}
</Paper>

              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <AppFooter />
    </>
  );
}
