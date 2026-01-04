"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { setUserIntent } from "@/lib/session";

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function IntentPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) {
    router.replace("/auth/signin");
    return null;
  }

  const handleSelect = async (intent: "mentor" | "mentee") => {
    await setUserIntent(user.uid, intent);
    router.push("/company-select");
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
            {/* LEFT: Intent Selection */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                }}
              >
                <Stack spacing={4}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                  >
                    What are you here for today?
                  </Typography>

                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => handleSelect("mentee")}
                    sx={{
                      py: 2,
                      fontSize: 16,
                      backgroundColor: "black",
                      "&:hover": {
                        backgroundColor: "#222",
                      },
                    }}
                  >
                    🎓 I want to get mentored
                  </Button>

                  <Button
                    size="large"
                    variant="outlined"
                    onClick={() => handleSelect("mentor")}
                    sx={{
                      py: 2,
                      fontSize: 16,
                      borderColor: "black",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        borderColor: "black",
                      },
                    }}
                  >
                    🤝 I want to mentor others
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* RIGHT: Instructions */}
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Typography variant="h4" fontWeight={700}>
                  How InterviewConsult sessions work
                </Typography>

                <Stack spacing={2}>
                  <Typography variant="body1">
                    💬 <strong>1:1 live chat session</strong> with
                    a real professional matched to your needs.
                  </Typography>

                  <Typography variant="body1">
                    ⏱ <strong>15-minute focused session</strong>{" "}
                    designed to answer specific interview
                    questions and strategies.
                  </Typography>

                  <Typography variant="body1">
                    🧠 <strong>Discuss real interview topics</strong>{" "}
                    like:
                  </Typography>

                  <Box pl={2}>
                    <Typography variant="body2">
                      • Company-specific interview questions
                    </Typography>
                    <Typography variant="body2">
                      • How to explain your projects
                    </Typography>
                    <Typography variant="body2">
                      • Behavioral & system design rounds
                    </Typography>
                    <Typography variant="body2">
                      • Resume & career guidance
                    </Typography>
                  </Box>

                  <Typography variant="body1">
                    🔒 Your conversations are private, and
                    sessions end automatically after time is
                    up.
                  </Typography>
                </Stack>

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
                    👉 <strong>Tip:</strong> Come prepared with
                    2–3 specific questions to make the most of
                    your session.
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
