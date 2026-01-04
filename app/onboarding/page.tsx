"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserProfile } from "@/lib/user";
import { useAuth } from "@/lib/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [experience, setExperience] = useState("");
  const [company, setCompany] = useState("");

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async () => {
    await createUserProfile({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      role: "frontend",
      experience: experience as "3-4" | "5-6",
      targetCompany: company,
      onboarded: true,
      createdAt: Date.now(),
    });

    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[400px] space-y-4 rounded border p-6">
        <h2 className="text-xl font-semibold">
          Personalize your interview journey
        </h2>

        <select
          className="w-full border p-2"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Experience</option>
          <option value="3-4">3–4 years</option>
          <option value="5-6">5–6 years</option>
        </select>

        <select
          className="w-full border p-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        >
          <option value="">Target company</option>
          <option value="Amazon">Amazon</option>
          <option value="Flipkart">Flipkart</option>
          <option value="Product">Product company</option>
        </select>

        <button
          disabled={!experience || !company}
          onClick={handleSubmit}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
