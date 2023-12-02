import React, { useContext, useEffect, useMemo, useState } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  Container,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // User icon
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthContextProps } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useNavBarContext } from '../contexts/NavBarContext';
import ArchiveIcon from '@mui/icons-material/Archive'; // Archive icon

import MenuIcon from '@mui/icons-material/Menu'; // Importing MenuIcon
import LeftDrawer from './LeftDrawer';

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

  const [drawerOpen, setDrawerOpen] = useState(false); // State for controlling drawer
  const theme = useThemeContext();

  const isLoginPage = window.location.pathname === '/login';

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Toggles the state of the drawer
  };

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  useEffect(() => {
    if (isLoginPage) {
      return;
    } else if ((!auth || !auth.user) && !auth?.userLoading) {
      if (!window.location.pathname.startsWith('/snapshots')) {
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
          flexGrow: 1,
          p: 0,
          m: 0,
          width: '100%',
        }}
        disableGutters
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'inherit',
            flexGrow: 1,
            m: 0,
            p: 0,
            px: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, p: 0 }}
            >
              <MenuIcon />
            </IconButton>
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
          </Box>

          {!isLoginPage && (
            <NavBarUserElem auth={auth} handleLogout={handleLogout} />
          )}
        </Container>
      </Toolbar>

      <LeftDrawer dIsOpen={drawerOpen} dToggle={handleDrawerToggle} />
    </AppBar>
  );
};

export default NavBar;
