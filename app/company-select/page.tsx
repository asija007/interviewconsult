// "use client";

// import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/useAuth";
// import { setSessionCompany } from "@/lib/session";
// import React from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { COMPANIES } from "@/lib/companies";

// import {
//   Box,
//   Button,
//   Container,
//   Grid,
//   MenuItem,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";

// import AppHeader from "../components/AppHeader";
// import AppFooter from "../components/AppFooter";



// export default function CompanySelectPage() {
//   const router = useRouter();
//   const { user, loading } = useAuth();

//   const [company, setCompany] = React.useState("");
//   const [experience, setExperience] = React.useState("");
//   const [techStack, setTechStack] = React.useState("");



// const [intent, setIntent] = React.useState<
//   "mentor" | "mentee" | null
// >(null);

// React.useEffect(() => {
//   if (!user) return;

//   const loadIntent = async () => {
//     const snap = await getDoc(
//       doc(db, "sessions", user.uid)
//     );

//     if (snap.exists()) {
//       setIntent(snap.data().intent);
//     }
//   };

//   loadIntent();
// }, [user]);



//   // ⚠️ intent is already stored by Intent page
//   // we just read it indirectly for UX copy
// //   const intent =
// //     typeof window !== "undefined"
// //       ? sessionStorage.getItem("intent") // optional UX hint
// //       : null;

//   if (loading) return <p className="p-6">Loading...</p>;

//   if (!user) {
//     router.push("/auth/signin");
//     return null;
//   }

//   const handleContinue = async () => {
//     await setSessionCompany(user.uid, company);
//     router.push("/payment");
//   };

//   const isMentor = intent === "mentor";

//   return (
//     <>
//       <AppHeader />

//       <Box
//         sx={{
//           minHeight: "calc(100vh - 64px)",
//           background:
//             "linear-gradient(135deg, #f9fafb 0%, #eef2f7 100%)",
//           py: { xs: 6, md: 10 },
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={6} alignItems="center">
//             {/* LEFT: FORM */}
//             <Grid item xs={12} md={6}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: { xs: 3, md: 5 },
//                   borderRadius: 4,
//                   border: "1px solid #e5e7eb",
//                   backgroundColor: "white",
//                 }}
//               >
//                 <Stack spacing={4}>
//                   <Typography
//                     variant="h4"
//                     fontWeight={700}
//                     textAlign="center"
//                   >
//                     {isMentor
//                       ? "Which company can you mentor for?"
//                       : "Which company are you targeting?"}
//                   </Typography>

//                   <TextField
//                     select
//                     label={
//                       isMentor
//                         ? "Company you can guide for"
//                         : "Target company"
//                     }
//                     value={company}
//                     onChange={(e : React.ChangeEvent<HTMLInputElement>) => setCompany(e.target.value)}
//                     fullWidth
//                     required
//                   >
//                     {/* {COMPANIES.map((c) => (
//                       <MenuItem key={c} value={c}>
//                         {c}
//                       </MenuItem>
//                     ))} */}

//                     {COMPANIES.map((company) => (
//   <button
//     key={company.id}
//     onClick={() => handleSelect(company.name)}
//     className="w-full rounded border px-4 py-3 hover:bg-gray-100"
//   >
//     {company.name}
//   </button>
// ))}

//                   </TextField>

//                   <TextField
//                     select
//                     label="Your experience level"
//                     value={experience}
//                     onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
//                       setExperience(e.target.value)
//                     }
//                     fullWidth
//                     required
//                   >
//                     {[
//                       "0–2 years",
//                       "2–4 years",
//                       "4–6 years",
//                       "6–10 years",
//                       "10+ years",
//                     ].map((exp) => (
//                       <MenuItem key={exp} value={exp}>
//                         {exp}
//                       </MenuItem>
//                     ))}
//                   </TextField>

//                   <TextField
//                     label="Primary tech stack"
//                     placeholder={
//                       isMentor
//                         ? "React, System Design, Java, AWS"
//                         : "React, Node.js, DSA, System Design"
//                     }
//                     value={techStack}
//                     onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
//                       setTechStack(e.target.value)
//                     }
//                     helperText="Comma separated"
//                     fullWidth
//                   />

//                   <Button
//                     size="large"
//                     variant="contained"
//                     disabled={!company}
//                     onClick={handleContinue}
//                     sx={{
//                       py: 1.5,
//                       backgroundColor: "black",
//                       "&:hover": {
//                         backgroundColor: "#222",
//                       },
//                     }}
//                   >
//                     Continue to session
//                   </Button>
//                 </Stack>
//               </Paper>
//             </Grid>

//             {/* RIGHT: EXPLANATION */}
//             <Grid item xs={12} md={6}>
//               <Stack spacing={4}>
//                 <Typography variant="h4" fontWeight={700}>
//                   {isMentor
//                     ? "How mentoring works"
//                     : "How your interview session works"}
//                 </Typography>

//                 <Stack spacing={2}>
//                   <Typography>
//                     💬 You’ll be matched with{" "}
//                     <strong>
//                       {isMentor
//                         ? "a candidate preparing for this company"
//                         : "a mentor experienced with this company"}
//                     </strong>
//                     .
//                   </Typography>

//                   <Typography>
//                     ⏱ Each session is{" "}
//                     <strong>15 minutes long</strong> and
//                     focused on real interview scenarios.
//                   </Typography>

//                   <Typography>
//                     🧠 Common discussion topics include:
//                   </Typography>

//                   <Box pl={2}>
//                     <Typography variant="body2">
//                       • Company-specific interview rounds
//                     </Typography>
//                     <Typography variant="body2">
//                       • Project explanations
//                     </Typography>
//                     <Typography variant="body2">
//                       • Behavioral questions
//                     </Typography>
//                     <Typography variant="body2">
//                       • System design / DSA guidance
//                     </Typography>
//                   </Box>

//                   <Typography>
//                     🔒 Sessions are private and automatically
//                     end after the allotted time.
//                   </Typography>
//                 </Stack>

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     p: 3,
//                     borderRadius: 3,
//                     backgroundColor: "#f9fafb",
//                     border: "1px dashed #d1d5db",
//                   }}
//                 >
//                   <Typography variant="body2">
//                     👉{" "}
//                     <strong>
//                       {isMentor ? "Mentor tip:" : "Candidate tip:"}
//                     </strong>{" "}
//                     {isMentor
//                       ? "Be specific and practical — candidates value real stories."
//                       : "Come prepared with 2–3 focused questions to maximize value."}
//                   </Typography>
//                 </Paper>
//               </Stack>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       <AppFooter />
//     </>
//   );
// }

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { setSessionCompany } from "@/lib/session";
import { COMPANIES } from "@/lib/companies";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function CompanySelectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [company, setCompany] = React.useState("");
  const [experience, setExperience] = React.useState("");
  const [techStack, setTechStack] = React.useState("");
  const [intent, setIntent] =
    React.useState<"mentor" | "mentee" | null>(null);

  /* Load intent from session */
  React.useEffect(() => {
    if (!user) return;

    const loadIntent = async () => {
      const snap = await getDoc(
        doc(db, "sessions", user.uid)
      );
      if (snap.exists()) {
        setIntent(snap.data().intent);
      }
    };

    loadIntent();
  }, [user]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  const isMentor = intent === "mentor";

  const handleContinue = async () => {
    await setSessionCompany(user.uid, company);
    router.push("/payment");
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
            {/* LEFT: FORM */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                }}
              >
                <Stack spacing={4}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                  >
                    {isMentor
                      ? "Which company can you mentor for?"
                      : "Which company are you targeting?"}
                  </Typography>

                  {/* Company select */}
                  <TextField
                    select
                    label={
                      isMentor
                        ? "Company you can guide for"
                        : "Target company"
                    }
                    value={company}
                    onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                      setCompany(e.target.value)
                    }
                    fullWidth
                    required
                  >
                    {COMPANIES.map((c) => (
                      <MenuItem
                        key={c.id}
                        value={c.name}
                      >
                        {c.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Experience */}
                  <TextField
                    select
                    label="Your experience level"
                    value={experience}
                    onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                      setExperience(e.target.value)
                    }
                    fullWidth
                    required
                  >
                    {[
                      "0–2 years",
                      "2–4 years",
                      "4–6 years",
                      "6–10 years",
                      "10+ years",
                    ].map((exp) => (
                      <MenuItem
                        key={exp}
                        value={exp}
                      >
                        {exp}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Tech stack */}
                  <TextField
                    label="Primary tech stack"
                    placeholder={
                      isMentor
                        ? "React, System Design, Java, AWS"
                        : "React, Node.js, DSA, System Design"
                    }
                    value={techStack}
                    onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                      setTechStack(e.target.value)
                    }
                    helperText="Comma separated"
                    fullWidth
                  />

                  <Button
                    size="large"
                    variant="contained"
                    disabled={!company}
                    onClick={handleContinue}
                    sx={{
                      py: 1.5,
                      backgroundColor: "black",
                      "&:hover": {
                        backgroundColor: "#222",
                      },
                    }}
                  >
                    Continue to session
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* RIGHT: INFO */}
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {isMentor
                    ? "How mentoring works"
                    : "How your interview session works"}
                </Typography>

                <Typography>
                  💬 You’ll be matched with{" "}
                  <strong>
                    {isMentor
                      ? "a candidate preparing for this company"
                      : "a mentor experienced with this company"}
                  </strong>
                  .
                </Typography>

                <Typography>
                  ⏱ Each session is{" "}
                  <strong>15 minutes</strong> and
                  highly focused.
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#f9fafb",
                    border: "1px dashed #d1d5db",
                  }}
                >
                  <Typography variant="body2">
                    👉{" "}
                    <strong>
                      {isMentor
                        ? "Mentor tip:"
                        : "Candidate tip:"}
                    </strong>{" "}
                    {isMentor
                      ? "Share real interview stories and practical advice."
                      : "Prepare 2–3 specific questions beforehand."}
                  </Typography>
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
