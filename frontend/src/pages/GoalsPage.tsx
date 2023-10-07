import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import apios from '../apios';
import { GoalOut } from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';


const GoalsPage: React.FC = () => {
    const [goals, setGoals] = useState<GoalOut[]>([]);
    const [newGoalText, setNewGoalText] = useState<string>('');
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth?.user) {
            navigate('/login');
            return;
        }

        const fetchGoals = async () => {
            try {
                const response = await apios.get('/goals');
                setGoals(response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    auth.logout();
                    navigate('/login');
                }
            }
        };

        fetchGoals();
    }, [auth, navigate]);


    const handleAddGoal = async () => {
        if (newGoalText.trim()) {
            const response = await apios.post('/goals', { text: newGoalText });
            if (response.data) {
                setGoals([...goals, response.data]);
                setNewGoalText('');
            }
        }
    };

    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          // Check for user's authentication status
          // For this example, we're simply checking if a token exists.
          if (!localStorage.getItem('token')) {
            navigate('/login');
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
        }
      };

      checkAuthStatus();
    }, [navigate]);


    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Your Goals
            </Typography>
            <List>
                {goals.map((goal) => (
                    <ListItem key={goal.id}>
                        {goal.text}
                    </ListItem>
                ))}
            </List>
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                value={newGoalText}
                onChange={e => setNewGoalText(e.target.value)}
                placeholder="Add new goal..."
            />
            <Button variant="contained" color="primary" onClick={handleAddGoal}>
                Add Goal
            </Button>
        </Box>
    );
};

export default GoalsPage;
