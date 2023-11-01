import React, { useState } from "react";
import useTheme from "@mui/material/styles/useTheme";
import {
  Box,
  Divider,
} from "@mui/material";
import { GoalOut } from "../../api";
import GoalHeader  from "./GoalHeader";
import GoalTasks from "./GoalTasks";
import GoalNotes from "./GoalNotes";

interface GoalItemProps {
  goal: GoalOut;
  onTaskToggle: (goalId: number, taskId: number, isCompleted: boolean) => void;
  onGoalDelete: Function;
  onTaskAdd: Function;
  onGoalUpdate: Function;
  onTaskDelete: (goalId: number, taskId: number) => void;
  mostRecentUpdate: Date;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onTaskToggle,
  onGoalDelete,
  onTaskAdd,
  onTaskDelete,
  onGoalUpdate,
}) => {
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");

  const maxElementWidth = "98vw !important";
  const maxNotesWidth = `calc(${maxElementWidth} - 48px) !important`;
  const theme = useTheme();

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
    const result = await onGoalUpdate(goal.id, editedText);
    if (result) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSaveNotes = async (updatedNotes: string | null) => {
    onGoalUpdate(goal.id, undefined, updatedNotes);
  };

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: `2px solid ${theme.palette.divider}`,
        p: 0.5, m: 0.25,
        display: "flex", // This turns it into a flex container
        flexDirection: "column", // Stack children vertically
        flexGrow: 1,
        backgroundColor: `#111111`,
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
        handleDelete={() => onGoalDelete(goal.id)}
        anchorEl={anchorEl}
        maxElementWidth={maxElementWidth}
      />
      <Divider
        sx={{
          backgroundColor: "#303030",
        }}
      />
      <GoalTasks
        newTaskText={newTaskText}
        setNewTaskText={setNewTaskText}
        handleAddTask={() => {
          if (newTaskText.trim()) {
            onTaskAdd(goal.id, newTaskText);
            setNewTaskText("");
          }
        }}
        goal={goal}
        onToggle={onTaskToggle}
        maxElementWidth={maxElementWidth}
        onTaskDelete={onTaskDelete}
      />
      <Divider
        sx={{
          backgroundColor: "#303030",
        }}
      />

      <Box
        sx={{
          ml: 0.5,
          mt: 0.25,
        }}
      >
      <GoalNotes
        goal={goal}
        maxNotesWidth={maxNotesWidth}
        onSaveNotes={handleSaveNotes}
      />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ opacity: 0.5, fontSize: "0.8em" }}>
          {goal && goal.updated_on
            ? `${new Date(goal.updated_on).toLocaleString()}`
            : ""}
        </Box>
      </Box>
    </Box>
  );
};

export default GoalItem;
