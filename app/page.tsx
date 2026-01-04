"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

export default function HomePage() {
  return (
    <Box>
      {/* ================= HEADER ================= */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left: Brand */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "black" }}
          >
            InterviewConsult
          </Typography>

          {/* Right: Auth */}
          <Stack direction="row" spacing={2}>
            <Button color="inherit" href="/auth/signin"sx={{
                backgroundColor: "black",
                "&:hover": { backgroundColor: "#222" },
              }}>
              Login
            </Button>
            <Button
              variant="contained"

              href="/prepare"
              sx={{
                backgroundColor: "black",
                "&:hover": { backgroundColor: "#222" },
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ================= HERO ================= */}
      <Box
        sx={{
          py: { xs: 8, md: 14 },
          background:
            "linear-gradient(135deg, #f9fafb 0%, #eef2f7 100%)",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={4} textalign="center">
            <Typography
              variant="h2"
              fontWeight={800}
              lineHeight={1.2}
            >
              Ready for your next interview?
              <br />
              <span style={{ color: "#555" }}>
                Consult with real experts.
              </span>
            </Typography>

            <Typography variant="h6" color="text.secondary">
              Personalized interview preparation with real mentors,
              live mock interviews, and focused guidance — exactly
              what interviewers want to hear.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
            <Button
  size="large"
  variant="contained"
  href="/prepare"
  sx={{
    px: 4,
    py: 1.5,
    backgroundColor: "black",
    "&:hover": { backgroundColor: "#222" },
  }}
>
  Start Preparing
</Button>


              <Button
                size="large"
                variant="outlined"
                href="/become-mentor"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: "black",
                  color: "black",
                  "&:hover": {
                    borderColor: "black",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Become a Mentor
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ================= VALUE PROPOSITION ================= */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={4}>
          {[
            {
              title: "Real Mentors, Real Interviews",
              desc: "Talk to engineers who have interviewed at top companies and know exactly what matters.",
            },
            {
              title: "Time-Bound, Focused Sessions",
              desc: "15-minute focused discussions. No fluff. No theory overload.",
            },
            {
              title: "Personalized Journey",
              desc: "Your experience, your target company, your gaps — we tailor everything.",
            },
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid #eee",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                  >
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= CTA ================= */}
      <Box
        sx={{
          py: 10,
          backgroundColor: "#111",
          color: "white",
        }}
      >
        <Container maxWidth="sm" textalign="center">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Your interview journey starts here
          </Typography>

          <Typography color="gray" mb={4}>
            Stop preparing alone. Get clarity, confidence, and
            direction from people who’ve been there.
          </Typography>

          <Button
            size="large"
            variant="contained"
            sx={{
              px: 5,
              py: 1.5,
              backgroundColor: "white",
              color: "black",
              "&:hover": { backgroundColor: "#eee" },
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box sx={{ py: 4, backgroundColor: "#fafafa" }}>
        <Container>
          <Typography
            variant="body2"
            color="text.secondary"
            textalign="center"
          >
            © {new Date().getFullYear()} InterviewConsult. All rights
            reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
