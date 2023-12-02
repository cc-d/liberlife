import React from 'react';
import {
  Drawer,
  Divider,
  Typography,
  Icon,
  IconButton,
  Box,
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
import { GoalIcon, TemplateIcon, SnapshotIcon } from './common';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import grey from '@mui/material/colors/grey';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const defPad = 2;

const LeftMenuLink: React.FC<any> = ({ to, icon, primary, onClick, theme }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      textDecoration: 'none',
      p: defPad,
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            m: 0,
            p: 0,
            pl: defPad,
            pr: defPad,
            pt: 1,
            pb: 1,
            backgroundColor: 'inherit',
          }}
        >
          <Typography
            variant="h5"
            noWrap
            sx={{
              display: 'flex',
              m: 0,
              p: 0,
              userSelect: 'none',
              flexDirection: 'row',
              alignItems: 'center',
              flexGrow: 1,
              color: theme.theme.palette.text.primary,
            }}
          >
            life.liberfy.ai
          </Typography>
          <IconButton
            color="inherit"
            aria-label="toggle theme"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(e) => {
              e.preventDefault();
              theme.toggleTheme();
            }}
            sx={{
              backgroundColor: 'inherit',
              ':hover': {
                backgroundColor:
                  theme.currentTheme === 'dark' ? grey[800] : grey[300],
              },
              ':active': {
                backgroundColor:
                  theme.currentTheme === 'dark' ? grey[700] : grey[200],
              },
              alignSelf: 'right',
              borderRadius: 5,
              display: 'flex',
            }}
          >
            {theme.currentTheme === 'dark' ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>
        </Box>
        <Divider />
        <LeftMenuLink
          to="/"
          icon={<GoalIcon />}
          primary="Goals"
          theme={theme}
        />
        <LeftMenuLink
          to="/archived"
          icon={<ArchiveIcon />}
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
          to="/snapshots"
          icon={<SnapshotIcon />}
          primary="Snapshots"
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
