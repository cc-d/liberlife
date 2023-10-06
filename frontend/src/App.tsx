import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import LogRegPage from './pages/LogRegPage';
import TasksPage from './pages/TasksPage';  // <-- Import the new TasksPage

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/login" element={<LogRegPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
