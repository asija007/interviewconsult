export type UserProfile = {
  uid: string;
  name: string | null;
  email: string | null;
  role?: "frontend";
  experience?: "3-4" | "5-6";
  targetCompany?: string;
  onboarded: boolean;
  createdAt: number; 
};
