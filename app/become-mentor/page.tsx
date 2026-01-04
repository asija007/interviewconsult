"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Stack,
  Paper,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function BecomeMentor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    currentRole: "",
    experience: "",
    primaryTech: "",
    mentorCompanies: "", // ⭐ IMPORTANT
    interviewExperience: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const splitValues = (val: string) =>
    val
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = await addDoc(
        collection(db, "preInterviewProfiles"),
        {
          role: "mentor", // ⭐ DIFFERENTIATOR
          name: form.name,
          currentRole: form.currentRole,
          experience: form.experience,
          primaryTech: splitValues(form.primaryTech),
          mentorCompanies: splitValues(form.mentorCompanies),
          interviewExperience: form.interviewExperience,
          createdAt: Date.now(),
        }
      );

      sessionStorage.setItem("preProfileId", docRef.id);
      router.push("/signup");
    } catch (error) {
      console.error("Failed to save mentor profile", error);
      alert("Something went wrong. Please try again.");
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
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* LEFT */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <Typography variant="h3" fontWeight={800}>
                  Become a mentor
                </Typography>

                <Typography color="text.secondary">
                  Share your experience and help candidates crack
                  interviews at top companies. Your expertise can
                  make a real difference.
                </Typography>

                <Typography color="text.secondary" fontSize={14}>
                  ⏱ Takes less than 2 minutes
                </Typography>
              </Stack>
            </Grid>

            {/* RIGHT */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Typography variant="h5" fontWeight={700}>
                      Mentor profile
                    </Typography>

                    <TextField
                      label="Full name"
                      required
                      value={form.name}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                        handleChange("name", e.target.value)
                      }
                      fullWidth
                    />

                    <TextField
                      label="Current role"
                      required
                      placeholder="e.g. Senior Frontend Engineer"
                      value={form.currentRole}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          "currentRole",
                          e.target.value
                        )
                      }
                      fullWidth
                    />

                    <TextField
                      select
                      label="Years of experience"
                      required
                      value={form.experience}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          "experience",
                          e.target.value
                        )
                      }
                      fullWidth
                    >
                      {[
                        "3–5 years",
                        "5–8 years",
                        "8–12 years",
                        "12+ years",
                      ].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Primary technologies"
                      placeholder="React, System Design, Java, AWS"
                      value={form.primaryTech}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          "primaryTech",
                          e.target.value
                        )
                      }
                      helperText="Comma separated"
                      fullWidth
                    />

                    <TextField
                      label="Companies you can mentor for ⭐"
                      placeholder="Amazon, Google, Flipkart"
                      value={form.mentorCompanies}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          "mentorCompanies",
                          e.target.value
                        )
                      }
                      helperText="This is used for matching"
                      required
                      fullWidth
                    />

                    <TextField
                      label="Your interview experience"
                      placeholder="Conducted interviews, cleared FAANG, panel member…"
                      value={form.interviewExperience}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          "interviewExperience",
                          e.target.value
                        )
                      }
                      multiline
                      rows={3}
                      fullWidth
                    />

                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        backgroundColor: "black",
                        "&:hover": {
                          backgroundColor: "#222",
                        },
                      }}
                    >
                      {loading
                        ? "Saving your mentor profile..."
                        : "Save and Continue"}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <AppFooter />
    </>
  );
}
