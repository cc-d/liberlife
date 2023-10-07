import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";
import { GoalTaskOut } from "../../api";

export const GoalTaskItem: React.FC<{
  task: GoalTaskOut;
  goalId: number;
  onToggle: Function;
}> = ({ task, goalId, onToggle }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => onToggle(goalId, task.id, task.completed)}
      sx={{ cursor: "pointer", mb: 1 }}
    >
      <Checkbox checked={task.completed} />
      <Box
        component="span"
        sx={{
          textDecoration: task.completed ? "line-through" : "none",
          flexGrow: 1,
        }}
      >
        <Typography>{task.text}</Typography>
      </Box>
    </Box>
  );
};
