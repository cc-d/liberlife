import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { GoalOut } from "../../api";
import { GoalHeader } from "./GoalHeader";
import { GoalTasks } from "./GoalTasks";

interface GoalItemProps {
  goal: GoalOut;
  onTaskToggle: (goalId: number, taskId: number, isCompleted: boolean) => void;
  onGoalDelete: Function;
  onTaskAdd: Function;
  onGoalUpdate: Function;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onTaskToggle,
  onGoalDelete,
  onTaskAdd,
  onGoalUpdate,
}) => {
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");
  const maxElementWidth = "400px";

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

  return (
    <Box
      sx={{
        backgroundColor: "#151515",
        padding: 0.5,
        borderRadius: 1,
        margin: 0.5,
        border: "1px solid #303030",
        display: "flex",        // This turns it into a flex container
        flexDirection: "column",  // Stack children vertically
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
        tasks={goal.tasks || []}
        goalId={goal.id}
        onToggle={onTaskToggle}
        maxElementWidth={maxElementWidth}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end",
    }}>
        {goal && goal?.updated_on && (
          <Box sx={{ color: "#777777", fontSize: "0.8em" }}>
            Last updated: {new Date(goal.updated_on).toLocaleDateString()}
          </Box>
        )}


      </Box>
    </Box>
  );
};

export default GoalItem;
