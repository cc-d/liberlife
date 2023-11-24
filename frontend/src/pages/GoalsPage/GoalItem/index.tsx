import React, { useState, useMemo } from "react";
import useTheme from "@mui/material/styles/useTheme";
import { Box, Divider } from "@mui/material";
import { GoalOut, TaskStatus } from "../../../api";
import GoalHeader from "./GoalHeader";
import GoalTasks from "./GoalTasks";
import GoalNotes from "./GoalNotes";
import deepGrey from "@mui/material/colors/grey";
import { actionTaskCompletion } from "../actions";

interface GoalItemProps {
  goal: GoalOut;
  handleGoalDelete: Function;
  handleAddTaskToGoal: Function;
  handleGoalUpdate: Function;
  handleDeleteTask: Function;
}

export const getLatestDate = (goal: GoalOut): string | null => {
  const goalDate: Number = new Date(goal.updated_on).getTime();
  let latestDate: Date = new Date(goal.updated_on);

  goal.tasks.forEach((task) => {
    const taskDate: Number = new Date(task.updated_on).getTime();
    if (taskDate > goalDate) {
      latestDate = new Date(task.updated_on);
    }
  });
  return latestDate ? latestDate.toLocaleString() : new Date().toLocaleString();
};

export const getLongestStr = (goal: GoalOut): number => {
  let longestStr: number = goal.text.length;
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

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  handleGoalDelete,
  handleAddTaskToGoal,
  handleDeleteTask,
  handleGoalUpdate,
}) => {
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");

  const [tasks, setTasks] = useState<GoalOut["tasks"]>(goal.tasks);

  const longestStr = getLongestStr(goal);
  const maxElementWidth = longestStr >= 13 ? "98vw" : "47.6vw";
  const theme = useTheme();
  const latestUpdate = getLatestDate(goal);

  const nextTaskStatus = async (taskId: number, taskStatus: TaskStatus) => {
    const originalTasks = tasks;
    try {
      // Now, update the tasks state using the functional update form
      // to ensure we are working with the most recent state.
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status:
                  taskStatus === TaskStatus.NOT_STARTED
                    ? TaskStatus.IN_PROGRESS
                    : taskStatus === TaskStatus.IN_PROGRESS
                    ? TaskStatus.COMPLETED
                    : TaskStatus.NOT_STARTED,
              }
            : task
        )
      );
      await actionTaskCompletion(taskId, goal);
      goal.tasks = tasks;
      goal.tasks = goal.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                taskStatus === TaskStatus.NOT_STARTED
                  ? TaskStatus.IN_PROGRESS
                  : taskStatus === TaskStatus.IN_PROGRESS
                  ? TaskStatus.COMPLETED
                  : TaskStatus.NOT_STARTED,
            }
          : task
      );
    } catch (error) {
      // Make sure to capture and handle any errors that might occur
      console.error("Failed to toggle task completion:", error);
      setTasks(originalTasks);
    }
  };

  useMemo(() => {
    if (goal) {
      setEditedText(goal.text);
    }
  }, [goal]);

  useMemo(() => {
    if (goal) {
      setTasks(goal.tasks);
    }
  }, [goal, tasks]);

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
    await handleGoalUpdate(
      goal.id,
      undefined,
      undefined,
      true ? !goal.archived : false
    );
    handleMenuClose();
  };

  const giWidth = longestStr < 13 ? `${1 + longestStr * 16}px` : `100%`; // 1rem for the checkbox

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: `2px solid ${theme.palette.divider}`,
        display: "flex", // This turns it into a flex container
        flexDirection: "column", // Stack children vertically
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,

        overflowWrap: "anywhere",
        opacity: goal.archived ? 0.5 : 1,

        p: 0,
        m: 0,
        ml: 0.25,
        mr: 0.25,
        minWidth: `150px`,
        width: {
          xs: giWidth,
          sm: "fit-content",
        },
        maxWidth: {
          xs: longestStr < 13 ? `calc(max(${longestStr}, 150px))` : "100%",
          sm: "100%",
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
      <GoalTasks
        newTaskText={newTaskText}
        setNewTaskText={setNewTaskText}
        handleAddTask={() => {
          if (newTaskText.trim()) {
            handleAddTaskToGoal(goal.id, newTaskText);
            setNewTaskText("");
          }
        }}
        tasks={tasks} // Pass the state here
        nextTaskStatus={nextTaskStatus}
        handleDeleteTask={handleDeleteTask}
        taskGoal={goal}
      />
      <Divider
        sx={{
          backgroundColor: "#303030",
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
