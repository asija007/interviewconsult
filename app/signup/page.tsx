"use client";

import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const googleProvider = new GoogleAuthProvider();

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Attach prepare data to user profile
   */
 const attachPrepareData = async (
  uid: string,
  email: string,
  name: string,
  provider: "password" | "google"
) => {
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    name,
    authProvider: provider,
    createdAt: Date.now(),
  });
};


  /**
   * Email + Password Signup
   */
//   const handleEmailSignup = async () => {
//     setLoading(true);

//     try {
//       const cred = await createUserWithEmailAndPassword(
//         auth,
//         form.email,
//         form.password
//       );

//       await attachPrepareData(
//         cred.user.uid,
//         cred.user.email!,
//         form.name,
//         "password"
//       );

//       router.push("/company-select");
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };


const handleEmailSignup = async () => {
  setLoading(true);

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    // 🔑 WAIT for auth state to be ready
    await new Promise<void>((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsub();
          resolve();
        }
      });
    });

    // Now Firestore write WILL be allowed
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      name: form.name,
      email: cred.user.email,
      authProvider: "password",
      createdAt: Date.now(),
    });

    router.push("/dashboard");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  /**
   * Google Signup
   */
  const handleGoogleSignup = async () => {
    setLoading(true);

    try {
      const cred = await signInWithPopup(auth, googleProvider);

      await attachPrepareData(
        cred.user.uid,
        cred.user.email!,
        cred.user.displayName || "User",
        "google"
      );

      router.push("/company-select");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background:
            "linear-gradient(135deg, #f9fafb 0%, #eef2f7 100%)",
          py: 10,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              border: "1px solid #e5e7eb",
            }}
          >
            <Stack spacing={4}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={700}>
                  Create your account
                </Typography>
                <Typography color="text.secondary" mt={1}>
                  Your interview journey is about to begin.
                </Typography>
              </Box>

              {/* Google */}
              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                Continue with Google
              </Button>

              <Divider>or</Divider>

              {/* Name */}
              <TextField
                label="Full name"
                value={form.name}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("name", e.target.value)
                }
                fullWidth
                required
              />

              {/* Email */}
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("email", e.target.value)
                }
                fullWidth
                required
              />

              {/* Password */}
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("password", e.target.value)
                }
                helperText="Minimum 6 characters"
                fullWidth
                required
              />

              <Button
                size="large"
                variant="contained"
                onClick={handleEmailSignup}
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#222" },
                }}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Already have an account?{" "}
                <a href="/login">Login</a>
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <AppFooter />
    </>
  );
}

