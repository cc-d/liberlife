import React from "react";
import { Box, Checkbox, Typography, IconButton } from "@mui/material";
import { GoalTaskOut, GoalOut, TaskStatus } from "../../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"; // For "not_started"
import PendingIcon from "@mui/icons-material/Pending"; // For "in_progress"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // For "completed"
import { useEffect, useMemo } from "react";
export const GoalTaskItem: React.FC<{
  taskGoal: GoalOut;
  task: GoalTaskOut;
  onToggle: Function;
  handleDeleteTask: Function;
}> = ({ taskGoal, task, onToggle, handleDeleteTask }) => {
  const StatusIcon =
    task.status === TaskStatus.NOT_STARTED
      ? CircleOutlinedIcon
      : task.status === TaskStatus.IN_PROGRESS
      ? PendingIcon
      : CheckCircleIcon;
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
      onClick={() => onToggle(task.id, task.status)}
    >
      <StatusIcon
        sx={{
          color:
            task.status === TaskStatus.NOT_STARTED
              ? "#FFC107"
              : task.status === TaskStatus.IN_PROGRESS
              ? "#2196F3"
              : "#4CAF50",
          mr: 0.5,
        }}
      />
      <Box
        sx={{
          textDecoration:
            task.status === TaskStatus.COMPLETED ? "line-through" : "none",
          color: "inherit",
          opacity: task.status === TaskStatus.COMPLETED ? 0.75 : 1,
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
