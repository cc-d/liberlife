import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import apios from '../apios';
import { TaskOut } from '../api';

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<TaskOut[]>([]);
    const [newTaskText, setNewTaskText] = useState<string>('');

    useEffect(() => {
        // Fetch tasks from API and set to state
        const fetchTasks = async () => {
            const response = await apios.get<TaskOut[]>('/t');  // Adjust with your API endpoint if different
            setTasks(response.data);
        };

        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        if (newTaskText.trim()) {
            const response = await apios.post('/t', { text: newTaskText });
            if (response.data) {
                setTasks([...tasks, response.data]);
                setNewTaskText('');
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Your Tasks
            </Typography>
            <List>
                {tasks.map((task) => (
                    <ListItem key={task.id}>
                        {task.text}
                    </ListItem>
                ))}
            </List>
            <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="Add new task..."
            />
            <Button variant="contained" color="primary" onClick={handleAddTask}>
                Add Task
            </Button>
        </Box>
    );
};

export default TasksPage;
