"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";


export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />

      <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-semibold">
            Sign in to InterviewConsult
          </h1>

          <p className="mb-6 text-sm text-gray-600">
            Welcome back. Continue your interview preparation.
          </p>

          {error && (
            <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Email sign in */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleEmailSignIn}
              disabled={loading || !email || !password}
              className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google sign in */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <span>🔐</span>
            <span>Continue with Google</span>
          </button>

          {/* Signup link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            New to InterviewConsult?{" "}
            <a
              href="/prepare"
              className="font-medium text-black underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>

      <AppFooter />
    </>
  );
}
