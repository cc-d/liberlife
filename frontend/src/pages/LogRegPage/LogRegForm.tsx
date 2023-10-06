import React, { useState, ChangeEvent, MouseEvent } from 'react';
import { TextField, Button, Box } from '@mui/material';

export interface LogRegFormState {
  username: string;
  password: string;
}

interface LogRegFormProps {
  isRegister?: boolean;
  onSubmit: (data: LogRegFormState) => Promise<void>;
}

const LogRegForm: React.FC<LogRegFormProps> = ({ isRegister = false, onSubmit }) => {
  const [state, setState] = useState({username: '', password: '' });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSubmit(state);
  };

  return (
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id={`${isRegister ? 'register' : 'login'}Username`}
        label="Username"
        name="username"
        autoFocus
        value={state.username}
        onChange={handleInputChange}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id={`${isRegister ? 'register' : 'login'}Password`}
        value={state.password}
        onChange={handleInputChange}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleSubmit}
      >
        {isRegister ? 'Register' : 'Login'}
      </Button>
    </Box>
  );
}

export default LogRegForm;
