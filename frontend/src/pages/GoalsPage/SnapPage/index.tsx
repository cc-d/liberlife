import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container } from '@mui/material';
import GoalBoard from '../GoalBoard';
import apios from '../../../utils/apios';
import { GoalOut } from '../../../api';
import { GBoardTypes } from '..';

const SnapshotGoalBoard: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [snapshotGoals, setSnapshotGoals] = useState<GoalOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshotGoals = async () => {
      if (!uuid) return;

      try {
        const response = await apios.get(`/snapshots/${uuid}`);
        setSnapshotGoals(response.data.goals);
      } catch (error) {
        console.error('Error fetching snapshot goals:', error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshotGoals();
  }, [uuid]);

  if (loading) {
    return <Typography>Loading snapshot...</Typography>;
  }

  return (
    <GoalBoard
      goals={snapshotGoals}
      setGoals={setSnapshotGoals}
      boardType={GBoardTypes.snapshot}
    />
  );
};

export default SnapshotGoalBoard;
