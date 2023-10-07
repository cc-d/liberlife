import React, { useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!auth || !auth.user) {
      navigate('/login');
    }
  }, [auth, navigate]);

  if (!auth || !auth.user) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          AppName
        </Typography>
        <Typography>{auth.user}</Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
