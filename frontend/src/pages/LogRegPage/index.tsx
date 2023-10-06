import React, { ReactNode } from "react";
import { Container, Typography, Box } from "@mui/material";
import apios from "../../apios";
import LogRegForm from "./LogRegForm";

const LogRegPage: React.FC = () => {
  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const response = await apios.post("/u/login", {
        username: data.username,
        password: data.password,
      });
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        // Navigate to the dashboard or home page after successful login
      }
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error, e.g. show a notification or message to the user
    }
  };

  const handleRegister = async (data: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await apios.post("/u/register", {
        username: data.username,
        password: data.password,
      });
      if (response.status === 200) {
        // Registration successful, can optionally auto-login or navigate to a confirmation page
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error, e.g. show a notification or message to the user
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <LogRegForm onSubmit={handleLogin} />

        <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
          Register
        </Typography>
        <LogRegForm isRegister onSubmit={handleRegister} />
      </Box>
    </Container>
  );
};

export default LogRegPage;
