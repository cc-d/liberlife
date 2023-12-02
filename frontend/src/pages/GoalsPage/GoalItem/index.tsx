import React, { useState, useMemo, useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { GoalOut, GoalTaskOut, TaskStatus } from '../../../api';
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

export const sortTasks = (a: GoalTaskOut, b: GoalTaskOut) => {
  const statusOrder = ['in progress', 'not started', 'completed'];
  const aStatus = statusOrder.indexOf(a.status);
  const bStatus = statusOrder.indexOf(b.status);
  if (aStatus < bStatus) {
    return -1;
  } else if (aStatus > bStatus) {
    return 1;
  } else {
    if (a.text < b.text) {
      return -1;
    } else if (a.text > b.text) {
      return 1;
    } else {
      return 0;
    }
  }
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
      await actionDeleteTask(goals, setGoals, goal.id, taskId);
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
      console.error('Failed to delete task:', e);
      setGoals(ogGoals);

      setTasks(ogTasks);
    }
  };

  useMemo(() => {
    const sortedTasks = [...goal.tasks].sort(sortTasks);
    setTasks(sortedTasks);
  }, [goal.tasks]);

  const handleTaskStatus = async (goalId: number, taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: getTaskStatus(task.status) as TaskStatus }
        : task
    );
    const ogGoals = goals;

    setGoals((prevGoals) =>
      prevGoals.map((g) =>
        g.id === goalId ? { ...g, tasks: updatedTasks } : g
      )
    );

    try {
      await apios.put(`/goals/${goalId}/tasks/${taskId}`);
    } catch (e) {
      console.error('Failed to update task status:', e);

      setGoals(ogGoals);
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
        opacity: goal.archived ? 0.75 : 1,
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
