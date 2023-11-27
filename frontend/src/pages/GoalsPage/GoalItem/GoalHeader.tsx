import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GoalOut } from '../../../api';

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
  const archText = goal.archived ? 'Unarchive' : 'Archive';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        p: 0.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexGrow: 1,
          width: '100%',
        }}
      >
        {isEditing ? (
          <>
            <TextField
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              sx={{
                display: 'flex',
                flexGrow: 1,
                maxWidth: '100%',
              }}
            />
            <IconButton onClick={handleSave} aria-label="save">
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleCancel} aria-label="cancel">
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                display: 'flex',
                flexGrow: 1,
                width: '100%',

                pl: 0.5,
              }}
            >
              {goal.text}
            </Typography>

            <IconButton onClick={handleMenuClick} aria-label="menu">
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
  );
};

export default GoalHeader;
