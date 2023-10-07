import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GoalOut } from "../../api";
import { GoalTaskItem } from "./GoalTaskItem";

export const GoalItem: React.FC<{
  goal: GoalOut;
  onTaskToggle: Function;
  onGoalDelete: Function;
  onTaskAdd: Function;
  onGoalUpdate: Function;
}> = ({ goal, onTaskToggle, onGoalDelete, onTaskAdd, onGoalUpdate }) => {
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onTaskAdd(goal.id, newTaskText);
      setNewTaskText("");
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

  const maxElementWidth = "400px";

  return (
    <Box
      sx={{
        backgroundColor: "#151515",
        padding: 1,
        borderRadius: 1,
        margin: 0.5,
        border: "1px solid #303030",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditing ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 1,
              flexGrow: 1,
            }}
          >
            <TextField
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              sx={{

                flexGrow: 1,
                maxWidth: maxElementWidth,
              }}
            />
            <IconButton onClick={handleSave}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Box>
        ) : (
          <>
            <Typography variant="h6" noWrap>
              {goal.text}
            </Typography>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={startEdit}>Edit</MenuItem>
              <MenuItem onClick={() => onGoalDelete(goal.id)}>Delete</MenuItem>
            </Menu>
          </>
        )}
      </Box>
      <Divider
        sx={{
          backgroundColor: "#303030",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: 1,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add task..."
          sx={{ flexGrow: 1, marginRight: 1 }}
        />
        <IconButton onClick={handleAddTask}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box mt={2}>
        {goal.tasks &&
          goal.tasks.map((task) => (
            <GoalTaskItem
              key={task.id}
              task={task}
              goalId={goal.id}
              onToggle={onTaskToggle}
              maxElementWidth={maxElementWidth}
            />
          ))}
      </Box>
    </Box>
  );
};
