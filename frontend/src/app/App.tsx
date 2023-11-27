import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Container from '@mui/material/Container';
import LogRegPage from '../pages/LogRegPage';
import GoalsPage from '../pages/GoalsPage';
import ProfilePage from '../pages/ProfilePage';
import NavBar from '../components/NavBar';
import SnapshotGoalBoard from '../pages/SnapPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <NavBar />
          <Container maxWidth={false} disableGutters sx={{ p: 1 }}>
            <Routes>
              <Route path="/" element={<GoalsPage />} />
              <Route path="/snapshots/:uuid" element={<SnapshotGoalBoard />} />
              <Route path="/login" element={<LogRegPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
