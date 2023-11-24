import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { GoalTaskOut, GoalOut, TaskStatus } from "../../../api";
import {
  CircleOutlined,
  Pending,
  CheckCircle,
  Delete,
} from "@mui/icons-material";
import deepBlue from "@mui/material/colors/blue";
import deepGreen from "@mui/material/colors/green";
import deepGrey from "@mui/material/colors/grey";
import theme from "../../../theme";
const statusIconMap = {
  [TaskStatus.NOT_STARTED]: (
    <CircleOutlined sx={{ color: deepGrey[500], mr: 0.25 }} />
  ),
  [TaskStatus.IN_PROGRESS]: <Pending sx={{ color: deepBlue[500], mr: 0.25 }} />,
  [TaskStatus.COMPLETED]: (
    <CheckCircle sx={{ color: deepGreen[500], mr: 0.25 }} />
  ),
};

export const TaskStatusIcon: React.FC<{ status: TaskStatus }> = ({
  status,
}) => {
  return statusIconMap[status];
};

export const GoalTaskItem: React.FC<{
  taskGoal: GoalOut;
  task: GoalTaskOut;
  handleTaskStatus: Function;
  handleDeleteTask: Function;
}> = ({ taskGoal, task, handleTaskStatus, handleDeleteTask }) => {
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
        color: "inherit",
        userSelect: "none",
        "&:active": {
          backgroundColor: theme.palette.action.selected,
        },
        "@media (pointer: fine)": {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }}
      key={task.id}
      onClick={() => handleTaskStatus(taskGoal.id, task.id)}
    >
      <TaskStatusIcon status={task.status} />
      <Box
        sx={{
          textDecoration:
            task.status === TaskStatus.COMPLETED ? "line-through" : "inherit",
          color:
            task.status === TaskStatus.COMPLETED
              ? theme.palette.text.primary
              : task.status === TaskStatus.IN_PROGRESS
              ? theme.palette.text.primary
              : theme.palette.text.primary,
          flexGrow: 1,

          overflowWrap: "anywhere",
        }}
      >
        <Typography
          sx={{
            flexGrow: 1,
            overflowWrap: "anywhere",
          }}
          variant="subtitle1"
        >
          {task.text}
        </Typography>
      </Box>
      <IconButton
        sx={{
          color: theme.palette.text.primary,
        }}
        onClick={(event) => {
          event.stopPropagation(); // Prevent triggering the onToggle when deleting
          handleDeleteTask(taskGoal?.id, task.id);
        }}
      >
        <Delete
          sx={{
            color: "inherit",
          }}
        />
      </IconButton>
    </Box>
  );
};

export default GoalTaskItem;
