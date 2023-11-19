import React from "react";
import { Box, Checkbox, Typography, IconButton } from "@mui/material";
import { GoalTaskOut, GoalOut } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useMemo } from "react";
export const GoalTaskItem: React.FC<{
  taskGoal: GoalOut;
  task: GoalTaskOut;
  onToggle: Function;
  handleDeleteTask: Function;
}> = ({ taskGoal, task, onToggle, handleDeleteTask }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        cursor: "pointer",
        flexGrow: 1,
        pt: 0.25,
        pb: 0.25,
        width: "100%",
        "&:active": {
          backgroundColor: "#303030",
        },
        "@media (pointer: fine)": {
          "&:hover": {
            backgroundColor: "#303030",
          },
        },
      }}
      key={task.id}
      onClick={() => onToggle(task.id, task.completed, taskGoal.id)}
    >
      <Checkbox checked={task.completed} sx={{ m: 0, p: 0.5, mr: 0.5 }} />
      <Box
        sx={{
          textDecoration: task.completed ? "line-through" : "none",
          color: "inherit",
          opacity: task.completed ? 0.75 : 1,
          flexGrow: 1,
          overflowWrap: "anywhere",
        }}
      >
        <Typography variant="subtitle1">{task.text}</Typography>
      </Box>
      <IconButton
        onClick={(event) => {
          event.stopPropagation(); // Prevent triggering the onToggle when deleting
          handleDeleteTask(taskGoal?.id, task.id);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default GoalTaskItem;
