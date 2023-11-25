import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { GoalTaskOut, GoalOut, TaskStatus } from '../../../api';
import {
  CircleOutlined,
  Pending,
  CheckCircle,
  Delete,
} from '@mui/icons-material';
import blue from '@mui/material/colors/blue';
import green from '@mui/material/colors/green';
import grey from '@mui/material/colors/grey';
import { useThemeContext } from '../../../contexts/ThemeContext';

import theme from '../../../theme';
const statusIconMap = {
  [TaskStatus.NOT_STARTED]: (
    <CircleOutlined sx={{ color: grey[500], mr: 0.25 }} />
  ),
  [TaskStatus.IN_PROGRESS]: <Pending sx={{ color: blue[500], mr: 0.25 }} />,
  [TaskStatus.COMPLETED]: <CheckCircle sx={{ color: green[500], mr: 0.25 }} />,
};

export const TaskStatusIcon: React.FC<{ status: TaskStatus }> = ({
  status,
}) => {
  return statusIconMap[status];
};

const GoalTaskItem: React.FC<{
  taskGoal: GoalOut;
  task: GoalTaskOut;
  handleTaskStatus: Function;
  handleDeleteTask: Function;
}> = ({ taskGoal, task, handleTaskStatus, handleDeleteTask }) => {
  const theme = useThemeContext();
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        cursor: 'pointer',
        flexGrow: 1,
        pt: 0.25,
        pb: 0.25,
        width: '100%',
        color: 'inherit',
        userSelect: 'none',
        '&:active': {
          backgroundColor: theme.theme.palette.action.selected,
        },
        '@media (pointer: fine)': {
          '&:hover': {
            backgroundColor: theme.theme.palette.action.hover,
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
            task.status === TaskStatus.COMPLETED ? 'line-through' : 'inherit',
          color:
            task.status === TaskStatus.COMPLETED
              ? theme.theme.palette.text.secondary
              : task.status === TaskStatus.IN_PROGRESS
              ? theme.theme.palette.text.primary
              : theme.theme.palette.text.primary,
          flexGrow: 1,

          overflowWrap: 'anywhere',
        }}
      >
        <Typography
          sx={{
            flexGrow: 1,
            overflowWrap: 'anywhere',
          }}
          variant="subtitle1"
        >
          {task.text}
        </Typography>
      </Box>
      <IconButton
        sx={{
          color: theme.theme.palette.text.primary,
        }}
        onClick={(event) => {
          event.stopPropagation(); // Prevent triggering the onToggle when deleting
          handleDeleteTask(taskGoal?.id, task.id);
        }}
      >
        <Delete
          sx={{
            color: 'inherit',
          }}
        />
      </IconButton>
    </Box>
  );
};

export default GoalTaskItem;
