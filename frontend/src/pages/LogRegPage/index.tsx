import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apios from '../../utils/apios';
import LogRegForm, { LogRegFormState } from './LogRegForm';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleLogin } from 'react-google-login';

const LogRegPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: LogRegFormState) => {
    try {
      const response = await apios.post('/u/login', {
        username: data.username,
        password: data.password,
      });
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        login(data.username, response.data.access_token); // <-- Pass the token here
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert(`Error during login: ${error}`);
    }
  };

  const handleRegister = async (data: LogRegFormState) => {
    try {
      const response = await apios.post('/u/register', {
        username: data.username,
        password: data.password,
      });
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        login(data.username, response.data.access_token); // <-- Pass the token here
        navigate('/');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert(`Error during registration: ${error}`);
      // Handle error, e.g. show a notification or message to the user
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      const googleData = { token: response.tokenId };
      const backendResponse = await apios.post('/u/google_login', googleData);
      if (backendResponse.data && backendResponse.data.access_token) {
        localStorage.setItem('token', backendResponse.data.access_token);
        login(response.profileObj.email, backendResponse.data.access_token);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={handleGoogleResponse}
        onFailure={handleGoogleResponse}
      />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <LogRegForm onSubmit={handleLogin} />

        <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
          Register
        </Typography>
        <Typography component="p" variant="subtitle2" sx={{}}>
          *no password requirements
        </Typography>
        <LogRegForm isRegister onSubmit={handleRegister} />
      </Box>
      <Link href="/tos.html" target="_blank" rel="noopener">
        Terms of Service
      </Link>
      <Link href="/privacy.html" target="_blank" rel="noopener">
        Privacy Policy
      </Link>
    </Container>
  );
};

export default LogRegPage;
