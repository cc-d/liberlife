import React, { useState } from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apios from '../../utils/apios';
import LogRegForm, { LogRegFormState } from './LogRegForm';
import { useAuth } from '../../contexts/AuthContext';

const enum ErrType {
  login = 'login',
  register = 'register',
}

const LogRegPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [logErr, setLogErr] = useState<string>('');
  const [regErr, setRegErr] = useState<string>('');

  const setErr = (err: any, errType: ErrType): string => {
    if (err.response && err.response.data && err.response.data.message) {
      err = err.response.data.message;
    } else if (err.message) {
      err = err.message;
    }

    const errTxt = `${errType} error: ${err}`;
    errType === ErrType.login ? setLogErr(errTxt) : setRegErr(errTxt);
    return errTxt;
  };

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
      handleErrors(error, ErrType.login);
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
      handleErrors(error, ErrType.register);
    }
  };

  const handleErrors = (error: any, errType: ErrType) => {
    console.error('Error during login/registration:', error);
    setErr(error, errType);
  };

  return (
    <Container component="main" maxWidth="xs">
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
        {logErr && (
          <Typography component="p" variant="subtitle2" sx={{ color: 'red' }}>
            {logErr}
          </Typography>
        )}
        <LogRegForm onSubmit={handleLogin} />

        <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
          Register
        </Typography>
        <Typography component="p" variant="subtitle2" sx={{}}>
          *no password requirements
        </Typography>
        {regErr && (
          <Typography component="p" variant="subtitle2" sx={{ color: 'red' }}>
            {regErr}
          </Typography>
        )}
        <LogRegForm isRegister onSubmit={handleRegister} />
      </Box>
      <Link href="/tos.html" target="_blank" rel="noopener">
        Terms of Service
      </Link>
      <Link
        href="/privpolicy.html"
        target="_blank"
        rel="noopener"
        sx={{ ml: 1 }}
      >
        Privacy Policy
      </Link>
    </Container>
  );
};

export default LogRegPage;
