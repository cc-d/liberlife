import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import LogRegPage from './pages/LogRegPage';
import GoalsPage from './pages/GoalsPage';
import NavBar from './components/NavBar';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// ... other imports


function App() {
  const user = localStorage.getItem('token') ? 'Username' : null;  // Placeholder logic for demo purposes

  return (
    <AuthProvider>


    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Router>
      {user && window.location.pathname !== '/login' && <NavBar user={user} />}
        <Routes>
          <Route path="/" element={<GoalsPage />} />
          <Route path="/login" element={<LogRegPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
