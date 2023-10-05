import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/u/token', {
        username,
        password,
      });
      const { access_token } = response.data;

      // Store the access token and manage user sessions
      console.log('Token:', access_token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
}

export default LoginPage;
