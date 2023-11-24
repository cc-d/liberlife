import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Box } from "@mui/system";
import LogRegPage from "./pages/LogRegPage";
import GoalsPage from "./pages/GoalsPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import SnapshotGoalBoard from "./pages/SnapPage";
import "./styles.css";

function App() {
  return (
    <Box
      sx={{
        backgroundColor: "black",
      }}
    >
      <AuthProvider>
        <ThemeProvider>
          <CssBaseline />

          <Router>
            <NavBar />
            <Routes>
              <Route path="/" element={<GoalsPage />} />
              <Route path="/snapshots/:uuid" element={<SnapshotGoalBoard />} />
              <Route path="/login" element={<LogRegPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </Box>
  );
}

export default App;
