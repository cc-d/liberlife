import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
  Typography,
  Icon,
  IconButton,
  Box,
  Container,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArchiveIcon from '@mui/icons-material/Archive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TaskSharp from '@mui/icons-material/TaskSharp';
import SaveIcon from '@mui/icons-material/Save';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavBarContext } from '../contexts/NavBarContext';
import { useThemeContext } from '../contexts/ThemeContext';

const LeftMenuLink: React.FC<any> = ({ to, icon, primary, onClick, theme }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      textDecoration: 'none',
      p: 1.5,
      m: 0,
      color: theme.theme.palette.text.primary,
      '&:hover': {
        backgroundColor: theme.theme.palette.action.hover,
      },
      '&.active': {
        backgroundColor: theme.theme.palette.action.selected,
      },
    }}
  >
    <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
      {icon}
    </IconButton>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
      {primary}
    </Typography>
  </Box>
);

interface LeftDrawerProps {
  dIsOpen: boolean;
  dToggle: () => void; // Corrected function type
}
export const LeftDrawer: React.FC<LeftDrawerProps> = ({ dIsOpen, dToggle }) => {
  const theme = useThemeContext();
  const auth = useAuth();

  if (!theme) return null;

  return (
    <Drawer open={dIsOpen} onClose={dToggle}>
      <Box
        sx={{
          width: 240,
          display: 'flex',
          flexDirection: 'column',
          m: 0,
          p: 0,
          color: theme.theme.palette.text.primary,
        }}
        role="presentation"
      >
        <Typography
          variant="h5"
          noWrap
          sx={{
            display: 'flex',
            m: 0,
            p: 2,
            userSelect: 'none',
            flexDirection: 'row',
            flexGrow: 1,
            color: theme.theme.palette.text.primary,
          }}
        >
          life.liberfy.ai
        </Typography>
        <Divider />
        <LeftMenuLink
          to="/"
          icon={<HomeIcon />}
          primary="Goals"
          theme={theme}
        />
        <LeftMenuLink
          to="/archived"
          icon={<SaveIcon />}
          primary="Archived"
          theme={theme}
        />
        <LeftMenuLink
          to="/profile"
          icon={<AccountBoxIcon />}
          primary="Profile"
          theme={theme}
        />
        <LeftMenuLink
          to="/login"
          icon={<LogoutIcon />}
          primary="Logout"
          theme={theme}
        />{' '}
        <Divider />
      </Box>
    </Drawer>
  );
};

export default LeftDrawer;
