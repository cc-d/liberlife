import React, { useState } from 'react';
import { Box, Typography, List, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GoalOut, GoalTaskOut } from '../../api';
import { GoalTaskItem } from './GoalTaskItem';

export const GoalItem: React.FC<{ goal: GoalOut, onTaskToggle: Function, onTaskAdd: Function }> = ({ goal, onTaskToggle, onTaskAdd }) => {
    const [newTaskText, setNewTaskText] = useState<string>('');

    const handleAddTask = async () => {
        if (newTaskText.trim()) {
            await onTaskAdd(goal.id, newTaskText);
            setNewTaskText('');
        }
    }

    return (
        <Box key={goal.id}>
            <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {goal.text}
                </Typography>
                <TextField
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    placeholder="New task..."
                    onKeyPress={e => e.key === 'Enter' && handleAddTask()}
                    size="small"
                    sx={{ mr: 2 }}
                />
                <IconButton size="small" onClick={handleAddTask}>
                    <AddIcon />
                </IconButton>
            </Box>
            <List>
                {goal.tasks && goal.tasks.map(task => (
                    <GoalTaskItem key={task.id} task={task} goalId={goal.id} onToggle={onTaskToggle} />
                ))}
            </List>
        </Box>
    );
}
