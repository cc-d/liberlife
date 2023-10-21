import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { Box } from "@mui/system";
import LogRegPage from "./pages/LogRegPage";
import GoalsPage from "./pages/GoalsPage";
import NavBar from "./components/NavBar";
import './styles.css';

export const primaryColor = "#2E8B57"; // SeaGreen
export const secondaryColor = "#006400"; // DarkGreen

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor, // SeaGreen
    },
    secondary: {
      main: secondaryColor, // DarkGreen
    },
    background: {
      default: '#121212',  // Dark background color
      paper: '#1E1E1E',    // Dark paper background
    },

  },
});


function App() {
  document.title = "life.liberfy.ai";
  return (
    <Box
      sx={{
        backgroundColor: 'black',
      }}
      >
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<GoalsPage />} />
            <Route path="/login" element={<LogRegPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
    </Box>
  );
}

export default App;
