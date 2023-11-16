import React, { useState, useEffect } from "react";
import useTheme from "@mui/material/styles/useTheme";
import { Box, Divider } from "@mui/material";
import { GoalOut } from "../../../api";
import GoalHeader from "./GoalHeader";
import GoalTasks from "./GoalTasks";
import GoalNotes from "./GoalNotes";

interface GoalItemProps {
  goal: GoalOut;
  toggleTaskCompletion: Function;
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
  toggleTaskCompletion,
  handleGoalDelete,
  handleAddTaskToGoal,
  handleDeleteTask,
  handleGoalUpdate,
}) => {
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");

  const longestStr = getLongestStr(goal);
  const maxElementWidth = longestStr >= 13 ? "98vw" : "47.6vw";
  const maxNotesWidth = `calc(${maxElementWidth} - 48px) !important`;
  const theme = useTheme();
  const latestUpdate = getLatestDate(goal);

  useEffect(() => {}, [goal]);

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

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: `2px solid ${theme.palette.divider}`,
        display: "flex", // This turns it into a flex container
        flexDirection: "column", // Stack children vertically
        flexGrow: 1,
        backgroundColor: `#111111`,

        overflowWrap: "anywhere",
        opacity: goal.archived ? 0.5 : 1,

        p: 0,
        m: 0,
        ml: 0.25,
        mr: 0.25,
        width: {
          xs: longestStr < 13 ? "47.6vw" : "fit-content",
          sm: "fit-content",
          md: "fit-content",
          lg: "fit-content",
          xl: "fit-content",
        },
        maxWidth: "100%",

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
        goal={goal}
        onToggle={toggleTaskCompletion}
        handleDeleteTask={handleDeleteTask}
      />
      <Divider
        sx={{
          backgroundColor: "#303030",
        }}
      />

      <GoalNotes
        goal={goal}
        maxNotesWidth={maxNotesWidth}
        onSaveNotes={handleSaveNotes}
        latestUpdate={latestUpdate}
      />
    </Box>
  );
};

export default GoalItem;
