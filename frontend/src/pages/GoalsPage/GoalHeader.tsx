import React from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GoalOut } from "../../api";

interface GoalHeaderProps {
  goal: GoalOut;
  isEditing: boolean;
  editedText: string;
  setEditedText: (text: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: () => void;
  startEdit: () => void;
  handleDelete: () => void;
  anchorEl: null | HTMLElement;
  maxElementWidth: string;
  handleArchive: () => void;
}

export const GoalHeader: React.FC<GoalHeaderProps> = ({
  goal,
  isEditing,
  editedText,
  setEditedText,
  handleSave,
  handleCancel,
  handleMenuClick,
  handleMenuClose,
  startEdit,
  handleDelete,
  anchorEl,
  maxElementWidth,
  handleArchive,
}) => {
  const archText = goal.archived ? "Unarchive" : "Archive";
  return (
    <Box
      sx={{
        maxWidth: maxElementWidth,
      }}
      >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          ml: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          {isEditing ? (
            <>
              <TextField
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                sx={{
                  width: `${Math.min(20, editedText.length)}ch !important`,
                  flexGrow: 1,
                }}
              />
              <IconButton onClick={handleSave}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{
                  flexGrow: 1,
                  maxWidth: maxElementWidth
              }}>
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
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                <MenuItem onClick={handleArchive}>{archText}</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GoalHeader;