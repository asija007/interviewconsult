"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/user";
import { useAuth } from "@/lib/useAuth";
import { logout } from "@/lib/auth";




export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      const profile = await getUserProfile(user.uid);

      // if (!profile || !profile.onboarded) {
      //   router.replace("/onboarding");
      //   return;
      // }

     router.replace("/intent");

    };

    if (!loading) {
      if (!user) {
        router.replace("/auth/signin");
      } else {
        checkProfile();
      }
    }
  }, [user, loading, router]);

  // 🔒 BLOCK UI until checks finish
  if (loading || !profileChecked) {
    return <p className="p-6">Preparing your journey...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Your personalized interview journey starts here.</p>
<button
  onClick={async () => {
    await logout();
    window.location.href = "/auth/signin";
  }}
  className="absolute right-6 top-6 rounded bg-red-500 px-4 py-2 text-white"
>
  Logout
</button>
    </div>
     
    
  );
}
