import { Box, Container, Typography } from "@mui/material";

export default function AppFooter() {
  return (
    <Box
      sx={{
        mt: 10,
        py: 4,
        borderTop: "1px solid #eee",
        backgroundColor: "#fafafa",
      }}
    >
      <Container>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          © {new Date().getFullYear()} InterviewConsult ·
          Prepare smarter. Interview better.
        </Typography>
      </Container>
    </Box>
  );
}
