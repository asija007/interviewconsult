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

export default function PreparePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    currentRole: "",
    experience: "",
    primaryTech: "",
    targetRoles: "",
    targetCompanies: "",
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
        name: form.name,
        currentRole: form.currentRole,
        experience: form.experience,
        primaryTech: splitValues(form.primaryTech),
        targetRoles: splitValues(form.targetRoles),
        targetCompanies: splitValues(form.targetCompanies),
        createdAt: Date.now(),
      }
    );

    // Optional (VERY USEFUL later)
    // Save this temp id in sessionStorage
    sessionStorage.setItem(
      "preProfileId",
      docRef.id
    );

    // Redirect to signup
    router.push("/signup");
  } catch (error) {
    console.error("Failed to save profile", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <AppHeader />

      {/* Hero + Form Section */}
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
            {/* LEFT: COPY */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  lineHeight={1.2}
                >
                  Your interview journey
                  <br />
                  starts here
                </Typography>

                <Typography color="text.secondary">
                  Share a few details about your background and
                  goals. We’ll tailor mentorship, mock interviews,
                  and preparation exactly to what top interviewers
                  expect.
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={14}
                >
                  ⏱ Takes less than 2 minutes
                </Typography>
              </Stack>
            </Grid>

            {/* RIGHT: FORM */}
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
                    <Typography
                      variant="h5"
                      fontWeight={700}
                    >
                      Tell us about you
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
                      placeholder="e.g. Frontend Engineer"
                      value={form.currentRole}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>    ) =>
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
                        "0–1 years",
                        "1–3 years",
                        "3–5 years",
                        "5–8 years",
                        "8+ years",
                      ].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Technologies you’re confident in"
                      placeholder="React, TypeScript, Node, AWS"
                      value={form.primaryTech}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>    ) =>
                        handleChange(
                          "primaryTech",
                          e.target.value
                        )
                      }
                      helperText="Comma separated"
                      fullWidth
                    />

                    <TextField
                      label="Roles you’re targeting"
                      placeholder="Frontend Engineer, Full Stack Engineer"
                      value={form.targetRoles}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          "targetRoles",
                          e.target.value
                        )
                      }
                      helperText="Comma separated"
                      fullWidth
                    />

                    <TextField
                      label="Target companies"
                      placeholder="Google, Amazon, Atlassian"
                      value={form.targetCompanies}
                      onChange={(e : React.ChangeEvent<HTMLInputElement>    ) =>
                        handleChange(
                          "targetCompanies",
                          e.target.value
                        )
                      }
                      helperText="Comma separated"
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
                        ? "Saving your details..."
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
