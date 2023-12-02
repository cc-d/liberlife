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
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ArchiveIcon from '@mui/icons-material/Archive';
import red from '@mui/material/colors/red';
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
  const menuItemSX = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    p: 1,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        m: 0,
        p: 0,
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
            <IconButton onClick={handleCancel} aria-label="cancel edit">
              <CancelIcon />
            </IconButton>
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
              <SaveIcon />
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
              {!goal.archived && (
                <MenuItem onClick={startEdit} disableGutters sx={menuItemSX}>
                  <EditIcon />
                  <Typography variant="body1">Edit</Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleArchive} disableGutters sx={menuItemSX}>
                {goal.archived ? (
                  <UnarchiveIcon fontSize="medium" />
                ) : (
                  <ArchiveIcon fontSize="medium" />
                )}
                <Typography variant="body1">{archText}</Typography>
              </MenuItem>
              <MenuItem onClick={handleDelete} disableGutters sx={menuItemSX}>
                <DeleteIcon fontSize="medium" sx={{ color: red[500] }} />
                <Typography variant="body1">Delete</Typography>
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
};

export default GoalHeader;
