import React, { useState, useMemo, useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { GoalOut, GoalTaskOut, TaskStatus } from '../../../api';
import GoalHeader from './GoalHeader';
import GoalTasks from './GoalTasks';
import GoalNotes from './GoalNotes';
import { actionDeleteTask } from '../../../utils/actions';
import { useThemeContext } from '../../../contexts/ThemeContext';
import apios from '../../../utils/apios';
import { getTaskStatus } from '../../../utils/helpers';

export interface GoalItemProps {
  goal: GoalOut;
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  handleGoalUpdate: any;
  isSnapshot?: boolean;
}

const getGoalDates = (goal: GoalOut): string[] => {
  let latestDate = new Date(goal.updated_on);
  let createdDate = new Date(goal.created_on);

  goal.tasks.forEach((task) => {
    const taskDate = new Date(task.updated_on);
    if (taskDate > latestDate) {
      latestDate = taskDate;
    }
  });
  return [
    latestDate.toLocaleString().split(',')[0],
    createdDate.toLocaleString().split(',')[0],
  ];
};

const getLongestStr = (goal: GoalOut): number => {
  let longestStr = goal.text.length;

  if (goal.notes) {
    const noLinkNotes = goal.notes?.replace(/(\[.*?\])\(.*?\)/g, '$1');
    if (noLinkNotes.length > longestStr) {
      longestStr = noLinkNotes.length;
    }
  }
  goal.tasks.forEach((task) => {
    if (task?.text && task.text.length > longestStr) {
      longestStr = task.text.length;
    }
  });
  return longestStr;
};

export const sortTasks = (a: GoalTaskOut, b: GoalTaskOut) => {
  const statusOrder = ['in progress', 'not started', 'completed'];
  const [aStat, bStat] = [a.status, b.status].map((status) =>
    status.toLowerCase().replace(' ', '').replace('_', '').trim()
  );
  const aStatus = statusOrder.indexOf(a.status);
  const bStatus = statusOrder.indexOf(b.status);

  const clog = (a: GoalTaskOut, b: GoalTaskOut, msg?: string) => {
    const msgStr = msg ? ` (${msg})` : '';
    console.log(a, a?.text, a?.status, b, b?.text, b?.status, msgStr);
  };

  if (
    ![aStat, bStat].includes('completed') ||
    (aStat === bStat && aStatus === bStatus)
  ) {
    // alphabetical
    clog(a, b, 'first if');
    return a.text.localeCompare(b.text);
  } else if (aStat === 'completed') {
    clog(a, b, 'second if');
    return 1;
  } else if (bStat === 'completed') {
    clog(a, b, 'third if');
    return -1;
  } else if (aStatus === bStatus) {
    clog(a, b, 'fourth if');
    return a.text.localeCompare(b.text);
  } else {
    clog(a, b, 'else');
    return 0;
  }
};

const newDemoTask = (newTaskText: string, goal: GoalOut): GoalTaskOut => {
  return {
    id: Math.floor(Math.random() * 100000),
    text: newTaskText,
    status: TaskStatus.NOT_STARTED,
    created_on: new Date().toISOString(),
    updated_on: new Date().toISOString(),
    goal_id: goal.id,
  };
};

const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  goals,
  setGoals,
  handleGoalUpdate,
  isSnapshot = false,
}) => {
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');
  const [tasks, setTasks] = useState<GoalOut['tasks']>(goal.tasks);

  const longestStr = useMemo(() => getLongestStr(goal), [goal]);
  const theme = useThemeContext();

  const [latestUpdate, createdDate] = useMemo(() => getGoalDates(goal), [goal]);

  const isDemo = window.location.pathname === '/demo';

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
    const result = !isDemo && (await handleGoalUpdate(goal.id, editedText));
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
      let newTask: GoalTaskOut;

      if (isDemo) {
        newTask = newDemoTask(newTaskText, goal);
      } else {
        const resp = await apios.post(`/goals/${goal.id}/tasks`, {
          text: newTaskText,
        });
        newTask = resp.data;
      }

      console.log('newTask:', newTask);

      setTasks([...tasks, newTask]);
      setGoals(
        goals.map((g) => {
          if (g.id === goal.id) {
            return {
              ...g,
              tasks: [...g.tasks, newTask],
            };
          }
          return g;
        })
      );

      setNewTaskText('');
    }
  };

  const giDeleteTask = async (goalId: number, taskId: number) => {
    const ogGoals = goals;
    const ogGoal = goal;
    const ogTasks = tasks;

    try {
      !isDemo && (await actionDeleteTask(goals, setGoals, goal.id, taskId));

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
    const sortedTasks = !goal?.tasks_locked
      ? [...goal.tasks].sort(sortTasks)
      : goal.tasks;
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

    if (isDemo) return;

    try {
      await apios.put(`/goals/${goalId}/tasks/${taskId}`);
    } catch (e) {
      console.error('Failed to update task status:', e);

      setGoals(ogGoals);
    }
  };

  const toggleTaskLock = async () => {
    const ogGoals = goals;

    setGoals((prevGoals) =>
      prevGoals.map((g) => {
        if (g.id === goal.id) {
          return { ...g, tasks_locked: !g.tasks_locked };
        }
        return g;
      })
    );

    if (isDemo) return;
    try {
      await handleGoalUpdate(
        goal.id,
        undefined,
        undefined,
        undefined,
        !goal.tasks_locked
      );
    } catch (e) {
      console.error('Failed to toggle task lock:', e);
      setGoals(ogGoals);
    }
  };

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

        maxWidth: '100%',
        minWidth: '140px',

        width: {
          xs: `calc(${longestStr} * 16px + 32px)`,
          sm: 'fit-content',
        },
        mb: 0.5,
        overflow: 'hidden',
      }}
    >
      <GoalHeader
        goal={goal}
        goals={goals}
        setGoals={setGoals}
        isEditing={isEditing}
        editedText={editedText}
        setEditedText={setEditedText}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleMenuClick={handleMenuClick}
        handleMenuClose={handleMenuClose}
        startEdit={startEdit}
        anchorEl={anchorEl}
        handleArchive={handleArchive}
        isSnapshot={isSnapshot}
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
        toggleTaskLock={toggleTaskLock}
        longestStr={longestStr}
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
