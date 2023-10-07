import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
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
    <Box
      key={goal.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid gray",
        padding: "16px",
        margin: "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "500px",
          minWidth: "200px",
        }}
      >
        <Typography variant="h6" noWrap>
          {goal.text}
        </Typography>
        <IconButton onClick={() => onGoalDelete(goal.id)} size="small">
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="New task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <IconButton onClick={handleAddTask} size="small">
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Box mt={2}>
        {goal.tasks &&
          goal.tasks.map((task) => (
            <GoalTaskItem
              key={task.id}
              task={task}
              goalId={goal.id}
              onToggle={onTaskToggle}
            />
          ))}
      </Box>
    </Box>
  );
};
