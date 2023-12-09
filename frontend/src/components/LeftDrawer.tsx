import React from 'react';
import {
  Drawer,
  Divider,
  Typography,
  Icon,
  IconButton,
  Box,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ArchiveIcon from '@mui/icons-material/Archive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { GoalIcon, TemplateIcon, SnapshotIcon } from './common';
import grey from '@mui/material/colors/grey';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import PrviewIcon from '@mui/icons-material/Preview';
import { alpha } from '@mui/material/styles';
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
  const defSX = { m: 0, p: 0, display: 'flex' };

  return (
    <Drawer open={dIsOpen} onClose={dToggle}>
      <Box
        sx={{
          ...defSX,
          width: 240,

          flexDirection: 'column',

          color: theme.theme.palette.text.primary,
        }}
        role="presentation"
      >
        <Box
          sx={{
            ...defSX,
            flexDirection: 'row',
            alignItems: 'center',

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
              ...defSX,
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
                  theme.currentTheme === 'dark' ? grey[800] : grey[200],
              },
              ':active': {
                backgroundColor:
                  theme.currentTheme === 'dark' ? grey[800] : grey[200],
              },
              alignSelf: 'right',
              borderRadius: 5,
              display: 'flex',
              border: `1px dashed ${alpha(
                theme.theme.palette.text.primary,
                0.1
              )}`,
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
          to="/snapshots"
          icon={<SnapshotIcon />}
          primary="Snapshots"
          theme={theme}
        />
        <LeftMenuLink
          to="/templates"
          icon={<TemplateIcon />}
          primary="Templates"
          theme={theme}
        />
        <LeftMenuLink
          to="/profile"
          icon={<AccountBoxIcon />}
          primary="Profile"
          theme={theme}
        />
        <LeftMenuLink
          to="/demo"
          icon={<PrviewIcon />}
          primary="Demo"
          theme={theme}
        />

        <Divider />
      </Box>
    </Drawer>
  );
};

export default LeftDrawer;
