import React from "react";
import { Box, Checkbox, Typography, IconButton } from "@mui/material";
import { GoalTaskOut } from "../../api";
import DeleteIcon from "@mui/icons-material/Delete";

export const GoalTaskItem: React.FC<{
  task: GoalTaskOut;
  goalId: number;
  onToggle: Function;
  maxElementWidth: string;
}> = ({ task, goalId, onToggle, maxElementWidth }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => onToggle(goalId, task.id, task.completed)}
      sx={{
        cursor: "pointer",
        mb: 1,
        "&:hover": {
          backgroundColor: "#303030",
        },
      }}
    >
      <Checkbox checked={task.completed} />
      <Box
        component="span"
        sx={{
          textDecoration: task.completed ? "line-through" : "none",
          flexGrow: 1,
          maxWidth: maxElementWidth,
          overflowWrap: "anywhere",
        }}
      >
        <Typography>{task.text}</Typography>
      </Box>
      <IconButton
        onClick={(e) => {
          e.stopPropagation(); // This prevents the parent onClick from being called
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
