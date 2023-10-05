import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import LoginPage from './pages/LoginPage';

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
        <Switch>
          <Route path="/login" exact component={LoginPage} />
          {/* Add more routes as needed */}
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
