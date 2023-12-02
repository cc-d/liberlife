// pages/SnapsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Divider,
  Container,
  Button,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import apios from '../../utils/apios';
import { SnapshotOut } from '../../api';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SnapsPage: React.FC = () => {
  const [snapshots, setSnapshots] = useState<SnapshotOut[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const deleteSnapshot = async (uuid: string) => {
    try {
      const response = await apios.delete(`/snapshots/${uuid}`);
      if (response?.status === 200) {
        setSnapshots(snapshots.filter((s) => s.uuid !== uuid));
      }
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      // Handle error appropriately
    }
  };

  const newSnapshot = async () => {
    try {
      const response = await apios.post('/snapshots');
      if ([200, 201].includes(response.status)) {
        setSnapshots([...snapshots, response.data]);
        nav(`/snapshots/${response.data.uuid}`);
      }
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
  }, []);

  return (
    <Box>
      <Typography variant="h4">Goal Snapshots</Typography>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Button
          variant="contained"
          onClick={() => newSnapshot()}
          sx={{ my: 1 }}
        >
          create snapshot
        </Button>
      </Box>
      <Divider sx={{ mt: 1, mb: 1 }} />

      {snapshots.map((snapshot) => (
        <Box
          component={RouterLink}
          to={`/snapshots/${snapshot.uuid}`}
          key={snapshot.uuid}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Typography variant="body1" sx={{ mr: 1, fontWeight: 'bold' }}>
            {snapshot.uuid}
          </Typography>
          <IconButton onClick={() => deleteSnapshot(snapshot.uuid)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default SnapsPage;
