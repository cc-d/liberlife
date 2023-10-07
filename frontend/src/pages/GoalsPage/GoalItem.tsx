import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { GoalOut } from "../../api";
import { GoalTaskItem } from "./GoalTaskItem";

export const GoalItem: React.FC<{
  goal: GoalOut;
  onTaskToggle: Function;
  onGoalDelete: Function;
  onTaskAdd: Function;
}> = ({ goal, onTaskToggle, onGoalDelete, onTaskAdd }) => {
  const [newTaskText, setNewTaskText] = useState<string>("");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onTaskAdd(goal.id, newTaskText);
      setNewTaskText("");
    }
  };

  return (
    <Box key={goal.id}>
      <Box
        display="inline-flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" display="inline">
          {goal.text}
        </Typography>
        <IconButton onClick={() => onGoalDelete(goal.id)} size="small">
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <TextField
        variant="outlined"
        size="small"
        placeholder="New task..."
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        sx={{ mr: 1 }}
      />
      <IconButton onClick={handleAddTask} size="small">
        <AddIcon fontSize="inherit" />
      </IconButton>

      <List>
        {goal.tasks &&
          goal.tasks.map((task) => (
            <GoalTaskItem
              key={task.id}
              task={task}
              goalId={goal.id}
              onToggle={onTaskToggle}
            />
          ))}
      </List>
    </Box>
  );
};
