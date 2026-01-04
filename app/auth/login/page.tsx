"use client";

import { signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

 const handleGoogleLogin = async () => {
  try {
    await signInWithGoogle();

    document.cookie =
      "firebase-auth=true; path=/; SameSite=Lax";

    router.push("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};


  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[360px] rounded-xl border p-6 shadow">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Interview Ready
        </h1>

        <button
          onClick={handleGoogleLogin}
          className="w-full rounded bg-black px-4 py-2 text-white"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
