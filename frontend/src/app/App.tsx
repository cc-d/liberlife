import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NavBarProvider } from '../contexts/NavBarContext';
import Container from '@mui/material/Container';
import LogRegPage from '../pages/LogRegPage';
import GoalsPage from '../pages/GoalsPage';
import ProfilePage from '../pages/ProfilePage';
import NavBar from '../components/NavBar';
import SnapshotGoalBoard from '../pages/GoalsPage/SnapPage';
import SnapsPage from '../pages/SnapsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <NavBarProvider>
            <NavBar />
            <Container maxWidth={false} sx={{ p: 1.5 }}>
              <Routes>
                <Route path="/" element={<GoalsPage archived={false} />} />
                <Route
                  path="/archived"
                  element={<GoalsPage archived={true} />}
                />
                <Route path="/snapshots" element={<SnapsPage />} />

                <Route
                  path="/snapshots/:uuid"
                  element={<SnapshotGoalBoard />}
                />
                <Route path="/login" element={<LogRegPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Container>
          </NavBarProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
