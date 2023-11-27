import React, { useState, useMemo, useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { GoalOut, TaskStatus } from '../../../api';
import GoalHeader from './GoalHeader';
import GoalTasks from './GoalTasks';
import GoalNotes from './GoalNotes';
import { actionAddTaskToGoal, actionDeleteTask } from '../../../utils/actions';
import { useThemeContext } from '../../../contexts/ThemeContext';
import apios from '../../../utils/apios';
import { getTaskStatus } from '../../../utils/helpers';

export interface GoalItemProps {
  goal: GoalOut;
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  handleGoalDelete: any;
  handleGoalUpdate: any;
  isSnapshot?: boolean;
}

const getLatestDate = (goal: GoalOut): string | null => {
  let latestDate = new Date(goal.updated_on);
  goal.tasks.forEach((task) => {
    const taskDate = new Date(task.updated_on);
    if (taskDate > latestDate) {
      latestDate = taskDate;
    }
  });
  return latestDate.toLocaleString();
};

const getLongestStr = (goal: GoalOut): number => {
  let longestStr = goal.text.length;
  if (goal.notes && goal.notes.length > longestStr) {
    longestStr = goal.notes.length;
  }
  goal.tasks.forEach((task) => {
    if (task.text.length > longestStr) {
      longestStr = task.text.length;
    }
  });
  return longestStr;
};

const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  goals,
  setGoals,
  handleGoalDelete,
  handleGoalUpdate,
}) => {
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');
  const [tasks, setTasks] = useState<GoalOut['tasks']>(goal.tasks);

  const longestStr = useMemo(() => getLongestStr(goal), [goal]);
  const maxElementWidth = longestStr >= 13 ? '98vw' : '47.6vw';
  const theme = useThemeContext();
  const latestUpdate = useMemo(() => getLatestDate(goal), [goal]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const startEdit = () => {
    setEditedText(goal.text);
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSave = async () => {
    const result = await handleGoalUpdate(goal.id, editedText);
    if (result) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSaveNotes = async (updatedNotes: string | null) => {
    handleGoalUpdate(goal.id, undefined, updatedNotes);
  };

  const handleArchive = async () => {
    await handleGoalUpdate(goal.id, undefined, undefined, !goal.archived);
    handleMenuClose();
  };
  const giAddTask = async () => {
    if (newTaskText.trim()) {
      await actionAddTaskToGoal(
        goals,
        setGoals,
        goal.id,
        newTaskText,
        tasks,
        setTasks
      );
      setNewTaskText('');
    }
  };

  const giDeleteTask = async (goalId: number, taskId: number) => {
    const ogGoals = goals;
    const ogGoal = goal;
    const ogTasks = tasks;

    try {
      // Perform the API call to delete the task
      await actionDeleteTask(goals, setGoals, goal.id, taskId);
      // Update the tasks state and the goals state
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
      setGoals((prevGoals) =>
        prevGoals.map((g) => {
          if (g.id === goal.id) {
            return {
              ...g,
              tasks: g.tasks.filter((task) => task.id !== taskId),
            };
          }
          return g;
        })
      );
    } catch (e) {
      // Handle errors (e.g., display a notification or log the error)
      console.error('Failed to delete task:', e);
      setGoals(ogGoals);

      setTasks(ogTasks);
    }
  };

  useMemo(() => {
    setTasks(goal.tasks.sort((a, b) => a.id - b.id));
  }, [goal.tasks]);
  const handleTaskStatus = async (goalId: number, taskId: number) => {
    // Determine the next status for the task
    // Optimistically update the task status in the UI
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: getTaskStatus(task.status) as TaskStatus }
        : task
    );
    setTasks(updatedTasks);

    try {
      // Send the update request to the server
      await apios.put(`/goals/${goalId}/tasks/${taskId}`);

      // Update the goals state with the new tasks array
      setGoals((prevGoals) =>
        prevGoals.map((g) =>
          g.id === goalId ? { ...g, tasks: updatedTasks } : g
        )
      );
    } catch (e) {
      console.error('Failed to update task status:', e);

      // Revert the tasks state to the original on failure
      setTasks(tasks);
    }
  };

  const giWidth = longestStr < 13 ? `${1 + longestStr * 16}px` : `100%`;

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: `2px solid ${theme.theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        backgroundColor: theme.theme.palette.background.paper,
        overflowWrap: 'anywhere',
        opacity: goal.archived ? 0.5 : 1,
        p: 0,
        m: 0,
        ml: 0.25,
        mr: 0.25,
        minWidth: `150px`,
        width: {
          xs: giWidth,
          sm: 'fit-content',
        },
        maxWidth: {
          xs: longestStr < 13 ? `calc(max(${longestStr}, 150px))` : '100%',
          sm: longestStr < 13 ? `calc(max(${longestStr}, 150px))` : '100%',
        },
        mb: 0.5,
      }}
    >
      <GoalHeader
        goal={goal}
        isEditing={isEditing}
        editedText={editedText}
        setEditedText={setEditedText}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleMenuClick={handleMenuClick}
        handleMenuClose={handleMenuClose}
        startEdit={startEdit}
        handleDelete={() => handleGoalDelete(goal.id)}
        anchorEl={anchorEl}
        maxElementWidth={maxElementWidth}
        handleArchive={handleArchive}
      />
      <Divider sx={{ backgroundColor: theme.theme.palette.divider }} />
      <GoalTasks
        newTaskText={newTaskText}
        setNewTaskText={setNewTaskText}
        handleAddTask={() => {
          if (newTaskText.trim()) {
            giAddTask();
          }
        }}
        tasks={tasks || []}
        handleTaskStatus={handleTaskStatus}
        taskGoal={goal}
        giDeleteTask={giDeleteTask}
        giAddTask={giAddTask}
      />
      <Divider
        sx={{
          backgroundColor: theme.theme.palette.divider,
        }}
      />
      <GoalNotes
        goal={goal}
        onSaveNotes={handleSaveNotes}
        latestUpdate={latestUpdate}
      />
    </Box>
  );
};

export default GoalItem;
