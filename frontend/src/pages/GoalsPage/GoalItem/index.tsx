import React, { useState, useMemo, useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { GoalOut } from '../../../api';
import GoalHeader from './GoalHeader';
import GoalTasks from './GoalTasks';
import GoalNotes from './GoalNotes';
import { actionAddTaskToGoal, actionDeleteTask } from '../actions';
import { useThemeContext } from '../../../contexts/ThemeContext';

export interface GoalItemProps {
  goal: GoalOut;
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  handleGoalDelete: any;
  handleGoalUpdate: any;
  handleTaskStatus: any;
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
  handleTaskStatus,
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
      await actionAddTaskToGoal(goals, setGoals, goal.id, newTaskText);
      setNewTaskText('');
      setGoals((prevGoals: GoalOut[]) =>
        prevGoals.map((g: any) => {
          if (g.id === goal.id) {
            const updatedTasks = [
              ...(g.tasks || []),
              {
                id: 0,
                text: newTaskText,
                updated_on: new Date().toISOString(),
              },
            ];
            setTasks(updatedTasks);
            return {
              ...g,
              tasks: updatedTasks,
            };
          }
          return g;
        })
      );
    }
  };

  const giDeleteTask = async (taskId: number) => {
    const ogGoals = [...goals];
    try {
      setGoals((prevGoals: GoalOut[]) =>
        prevGoals.map((g: GoalOut) => {
          if (g.id === goal.id) {
            const updatedTasks = (g.tasks || []).filter(
              (task: any) => task.id !== taskId
            );
            setTasks(updatedTasks);
            return {
              ...g,
              tasks: updatedTasks,
            };
          }
          return g;
        })
      );
      await actionDeleteTask(goals, setGoals, goal.id, taskId);
    } catch (e) {
      setGoals(ogGoals);
    }
  };

  const giWidth = longestStr < 13 ? `${1 + longestStr * 16}px` : `100%`;

  useMemo(() => {
    setTasks(goal.tasks.sort((a, b) => a.id - b.id));
  }, [goal.tasks]);

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
            actionAddTaskToGoal(goals, setGoals, goal.id, newTaskText);
            setNewTaskText('');
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
