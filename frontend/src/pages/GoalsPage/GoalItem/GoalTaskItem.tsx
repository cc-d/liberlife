import React from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import { GoalTaskOut, GoalOut, TaskStatus } from '../../../api';
import {
  AssignmentOutlined as CircleOutlined,
  AssignmentLate as Pending,
  AssignmentTurnedIn as CheckCircle,
  Delete,
} from '@mui/icons-material';
import blue from '@mui/material/colors/blue';
import green from '@mui/material/colors/green';
import grey from '@mui/material/colors/grey';
import { useThemeContext } from '../../../contexts/ThemeContext';

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
  const { theme } = useThemeContext();

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        cursor: 'pointer',
        flexGrow: 1,
        p: 0,
        py: 0.5,
        width: '100%',
        color: 'inherit',
        userSelect: 'none',
        '&:active': {
          backgroundColor: theme.palette.action.selected,
        },
        '@media (pointer: fine)': {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }}
      key={task.id}
      onClick={() => handleTaskStatus(taskGoal.id, task.id)}
    >
      <Box
        sx={{
          textDecoration:
            task.status === TaskStatus.COMPLETED ? 'line-through' : 'inherit',
          color:
            task.status === TaskStatus.COMPLETED
              ? theme.palette.text.secondary
              : task.status === TaskStatus.IN_PROGRESS
              ? theme.palette.text.primary
              : theme.palette.text.primary,
          flexGrow: 1,

          overflowWrap: 'anywhere',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          pl: 0.5,
        }}
      >
        <TaskStatusIcon status={task.status} aria-label="task status" />
        <Typography
          sx={{
            flexGrow: 1,
            overflowWrap: 'anywhere',
          }}
          variant="body1"
        >
          {task.text}
        </Typography>
      </Box>
      <IconButton
        sx={{
          color: theme.palette.text.primary,
          p: 1,

          m: 0,
        }}
        onClick={(event) => {
          event.stopPropagation();
          handleDeleteTask(taskGoal.id, task.id);
        }}
        aria-label="delete"
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
