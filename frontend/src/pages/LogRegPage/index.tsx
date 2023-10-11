import React, { ReactNode } from "react";
import { Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apios from "../../apios";
import LogRegForm, { LogRegFormState } from "./LogRegForm";
import { useAuth } from "../../contexts/AuthContext";

const LogRegPage: React.FC = () => {
  const nav = useNavigate();

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: LogRegFormState) => {
    try {
      const response = await apios.post("/u/login", {
        username: data.username,
        password: data.password,
      });
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        login(data.username, response.data.access_token); // <-- Pass the token here
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleRegister = async (data: LogRegFormState) => {
    try {
      const response = await apios.post("/u/register", {
        username: data.username,
        password: data.password,
      });
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        login(data.username, response.data.access_token); // <-- Pass the token here
        navigate("/");
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
