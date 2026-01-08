"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";

export default function AppHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    setOpen(false);
  };

  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 🔥 Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold"
        >
          <img
            src="/integrity.png"
            alt="InterviewConsult logo"
            className="h-6 w-6"
          />
          <span>InterviewConsult</span>
        </Link>

        {/* Desktop nav */}
        {!loading && (
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded bg-red-500 px-4 py-2 text-sm text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium"
                >
                  Sign in
                </Link>

                <Link
                  href="/signup"
                  className="rounded bg-black px-4 py-2 text-sm text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && !loading && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block text-sm font-medium"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="w-full rounded bg-red-500 px-4 py-2 text-sm text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                onClick={() => setOpen(false)}
                className="block text-sm font-medium"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block rounded bg-black px-4 py-2 text-sm text-white text-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
