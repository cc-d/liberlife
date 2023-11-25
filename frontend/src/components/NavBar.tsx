import React, { useContext, useEffect, useMemo } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // User icon
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextProps } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

interface NavBarUserElemProps {
  auth: AuthContextProps | undefined;
  handleLogout: () => void;
}

const NavBarUserElem: React.FC<NavBarUserElemProps> = ({
  auth,
  handleLogout,
}) => {
  const nav = useNavigate();
  if (!auth || auth?.userLoading) {
    return (
      <Typography variant="h6" sx={{ mr: 2, color: 'inherit' }}>
        Loading...
      </Typography>
    );
  }

  if (!auth.user) {
    return (
      <Button
        variant="text"
        color="inherit"
        onClick={() => nav('/login')}
        aria-label="login"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        sx={{ borderRadius: '8px' }}
      >
        Login
      </Button>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        color="inherit"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        aria-expanded={false}
        onClick={(e) => {
          e.preventDefault();
          nav('/profile');
        }}
        href="/profile"
        sx={{ mr: 1, borderRadius: '8px' }}
      >
        <AccountCircleIcon />
        <Typography variant="h6" sx={{ mr: 0, color: 'inherit' }}>
          {auth.user}
        </Typography>
      </IconButton>
      <IconButton
        color="inherit"
        onClick={handleLogout}
        aria-label="logout"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        aria-expanded={false}
        sx={{ borderRadius: '8px' }}
      >
        <LogoutIcon />
      </IconButton>
    </Box>
  );
};

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const theme = useThemeContext();

  const isLoginPage = window.location.pathname === '/login';
  const isSnapPage = window.location.pathname.startsWith('/snapshot');

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  useEffect(() => {
    if (isLoginPage) {
      return;
    } else if ((!auth || !auth.user) && !auth?.userLoading) {
      if (!window.location.pathname.startsWith('/snapshots')) {
        alert('Redirecting to login page');
        navigate('/login');
      }
    }
  }, [auth?.userLoading]);

  if (window.location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar position="static" sx={{}}>
      <Toolbar
        variant="dense"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'inherit',
          pl: 1,
          pr: 1,
        }}
        disableGutters
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'inherit',
          }}
        >
          <Typography
            variant="h6"
            color="inherit"
            sx={{ textDecoration: 'none', '&:hover': { cursor: 'pointer' } }}
            component="a"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('');
            }}
          >
            life.liberfy.ai
          </Typography>

          {!isLoginPage && (
            <NavBarUserElem auth={auth} handleLogout={handleLogout} />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
