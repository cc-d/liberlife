import React from 'react';
import { Box, TextField, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { GoalTaskOut, GoalOut } from '../../../api';
import GoalTaskItem from './GoalTaskItem'; // Update the import statement
import theme from '../../../app/theme';
import LockIcon from '@mui/icons-material/Lock';
import { useThemeContext } from '../../../contexts/ThemeContext';

export interface GoalTasksProps {
  newTaskText: string;
  setNewTaskText: any;
  handleAddTask: () => void;
  tasks: GoalTaskOut[];
  handleTaskStatus: (goalId: number, taskId: number) => Promise<void>;
  taskGoal: GoalOut;
  giDeleteTask: Function;
  giAddTask: () => Promise<void>;
  toggleTaskLock: () => Promise<void>;
}

export const GoalTasks: React.FC<GoalTasksProps> = ({
  newTaskText,
  setNewTaskText,
  handleAddTask,
  taskGoal,
  tasks, // Receive tasks as a prop
  handleTaskStatus,
  giDeleteTask,
  giAddTask,
  toggleTaskLock,
}) => {
  const { theme } = useThemeContext();
  const taskLockColor = taskGoal?.tasks_locked
    ? theme.palette.primary.main
    : theme.palette.text.primary;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Divider
        sx={{
          backgroundColor: theme.palette.background.default,
          m: 0,
          p: 0,
          ml: 0.5,
          mr: 0.5,
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: 0.5,
          mr: 0.5,
          height: '100%',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',

            mt: 1,
          }}
        >
          <IconButton
            aria-label="lock goal tasks"
            sx={{ color: taskLockColor, display: 'flex', m: 0, p: 0, mr: 1 }}
            onClick={toggleTaskLock}
          >
            <LockIcon />
          </IconButton>

          <TextField
            variant="outlined"
            size="small"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add task..."
            sx={{ flexGrow: 1, marginRight: 1 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
          />
          <IconButton
            onClick={handleAddTask}
            aria-label="add task"
            sx={{ color: 'primary.text.main' }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            m: 0,
            p: 0,
            mt: 1,
            mb: 1,
          }}
        >
          {tasks &&
            tasks.map((task) => (
              <GoalTaskItem
                key={task.id} // Ensure key prop is set
                taskGoal={taskGoal}
                task={task}
                handleTaskStatus={handleTaskStatus}
                handleDeleteTask={giDeleteTask}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default GoalTasks;
