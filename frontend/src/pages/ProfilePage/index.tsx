import React, { useState, useEffect } from 'react';
import { Typography, Box, Divider, Button, IconButton } from '@mui/material';
import { SnapshotOut } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import apios from '../../utils/apios';
import grey from '@mui/material/colors/grey';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';
import UserIcon from '@mui/icons-material/AccountCircle';

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const theme = useThemeContext();

  return (
    <Box className="ProfilePage">
      {auth.userLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              fontSize: '5rem',
            }}
          >
            <UserIcon sx={{ fontSize: 'inherit' }} />
            <Typography
              sx={{
                fontSize: 'inherit',
              }}
            >
              {auth.user}
            </Typography>
          </Box>
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

              borderRadius: 5,
            }}
          >
            <Brightness4Icon sx={{ mr: 1 }} />
            {theme.currentTheme === 'dark' ? 'light mode' : 'dark mode'}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ProfilePage;
