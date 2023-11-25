import React, { useState, useEffect } from 'react';
import { Typography, Box, Divider, Button, IconButton } from '@mui/material';
import { SnapshotOut } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import apios from '../../utils/apios';
import grey from '@mui/material/colors/grey';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const [snapshots, setSnapshots] = useState<SnapshotOut[]>([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const theme = useThemeContext();
  const nav = useNavigate();

  const newSnapshot = async () => {
    try {
      const response = await apios.post('/snapshots');
      nav(`/snapshots/${response.data.uuid}`);
    } catch (error) {
      console.error('Error creating snapshot:', error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const response = await apios.get('/snapshots');
        setSnapshots(response.data);
      } catch (error) {
        console.error('Error fetching snapshots:', error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [auth?.user]);

  return (
    <Box className="ProfilePage">
      <Typography variant="h3">Profile</Typography>

      {auth.userLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <Box>
          <Typography variant="h4">Logged in as: {auth.user}</Typography>
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
            <Brightness4Icon />
            {theme.currentTheme === 'dark' ? 'light mode' : 'dark mode'}
          </IconButton>
        </Box>
      )}

      <Divider sx={{ mt: 1, mb: 1 }} />

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h4">Snapshots</Typography>
        <Button
          variant="contained"
          onClick={() => newSnapshot()}
          sx={{ ml: 2 }}
        >
          Create snapshot
        </Button>
      </Box>

      {snapshots.map((snapshot) => (
        <RouterLink to={`/snapshots/${snapshot.uuid}`}>
          <Typography
            key={snapshot.uuid}
            variant="body1"
            sx={{ cursor: 'pointer' }}
          >
            {snapshot.uuid}
          </Typography>
        </RouterLink>
      ))}
    </Box>
  );
};

export default ProfilePage;
