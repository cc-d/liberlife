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
import TemplatesPage from '../pages/TemplatesPage';
import DemoPage from '../pages/DemoPage';
import { GBoardTypes } from '../pages/GoalsPage';
import BuildInfo from '../components/BuildInfo';
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <NavBarProvider>
            <NavBar />
            <Container maxWidth={false} sx={{ p: 1.5 }} disableGutters>
              <Routes>
                <Route path="/demo" element={<DemoPage />} />
                <Route
                  path="/"
                  element={<GoalsPage boardType={GBoardTypes.default} />}
                />
                <Route
                  path="/archived"
                  element={<GoalsPage boardType={GBoardTypes.archived} />}
                />
                <Route path="/snapshots" element={<SnapsPage />} />
                <Route
                  path="/snapshots/:uuid"
                  element={<SnapshotGoalBoard />}
                />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/login" element={<LogRegPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
              <BuildInfo />
            </Container>
          </NavBarProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
