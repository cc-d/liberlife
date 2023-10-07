import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import apios from '../apios';
import { GoalOut, GoalTaskOut } from '../api';
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


    const toggleTaskCompletion = async (goalId: number, taskId: number, isCompleted: boolean) => {
        try {
            const response = await apios.put(`/goals/${goalId}/tasks/${taskId}`, { completed: !isCompleted });
            if (response.status === 200) {
                setGoals(goals.map(goal => {
                    if (goal.id === goalId && typeof(goal.tasks) !== 'undefined') {
                        goal.tasks.map(task => {
                            if (task.id === taskId) {
                                task.completed = !isCompleted;
                            }
                            return task;
                        });
                    }
                    return goal;
                }));
            }
        } catch (error) {
            console.error("Error updating task completion status:", error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 5 }}>
            {/* ... (Other components and JSX) */}
            <List>
                {goals.map((goal) => (
                    <Box key={goal.id}>
                        <Typography variant="h6">{goal.text}</Typography>
                        <List>
                            {goal.tasks && goal.tasks.map(task => (
                                <ListItem
                                    key={task.id}
                                    onClick={() => toggleTaskCompletion(goal.id, task.id, task.completed)}
                                    style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                                >
                                    {task.text}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default GoalsPage;
