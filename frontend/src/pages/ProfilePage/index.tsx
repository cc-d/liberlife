import React, { useState, useEffect } from 'react';
import { Typography, Box, Divider, Button } from '@mui/material';
import { SnapshotOut } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import apios from '../../apios';
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
          <Typography variant="body1">Logged in as: {auth.user}</Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.theme.palette.background.paper,
            }}
            onClick={() => {
              theme.toggleTheme();
            }}
          >
            {theme.currentTheme === 'dark' ? 'Light' : 'Dark'} theme
          </Button>
        </Box>
      )}

      <Divider sx={{ mt: 1, mb: 1 }} />

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h4">Snapshots</Typography>
        <Button
          variant="contained"
          color="primary"
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
