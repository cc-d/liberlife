import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  TextField,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import apios from "../../apios";
import { GoalOut } from "../../api";
import { GoalHeader } from "./GoalHeader";
import { GoalTasks } from "./GoalTasks";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { wrap } from "module";

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

  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [editedNotes, setEditedNotes] = useState<string | null | undefined>(
    goal.notes
  );
  const maxElementWidth = "480px";

  const maxNotesWidth = `calc(${maxElementWidth} - 48px) !important`;

  const handleSaveNotes = async () => {
    const updatedNotes =
      editedNotes && editedNotes.trim() !== "" ? editedNotes : null;
    const goalUpdated = onGoalUpdate(goal.id, undefined, updatedNotes);
    if (goalUpdated) {
      setIsEditingNotes(false);
    }
  };

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
        display: "flex", // This turns it into a flex container
        flexDirection: "column", // Stack children vertically
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
        {isEditingNotes ? (
          <Box display="flex" alignItems="center">
            <TextField
              value={editedNotes || ""}
              onChange={(e) => setEditedNotes(e.target.value)}
              multiline
              sx={{
                width: maxNotesWidth,
                flexGrow: 1,
                mt: 0.25,
              }}
            />
            <IconButton onClick={handleSaveNotes}>
              <SaveIcon />
            </IconButton>
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            <Typography
              color={goal && goal.notes ? "textPrimary" : "textSecondary"}
              sx={{
                maxWidth: maxNotesWidth,
                overflowWrap: "break-word",
              }}
            >
              {goal.notes ? goal.notes : "add notes..."}
            </Typography>
            <IconButton onClick={() => setIsEditingNotes(true)}>
              <EditIcon />
            </IconButton>
          </Box>
        )}
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
