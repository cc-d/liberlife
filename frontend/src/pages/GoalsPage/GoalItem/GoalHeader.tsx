import React, { useMemo } from 'react';
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
import { actionUpdateGoal, actihandleGoalDelete } from '../../../utils/actions';

interface GoalHeaderProps {
  goal: GoalOut;
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  isEditing: boolean;
  editedText: string;
  setEditedText: (text: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleMenuClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: () => void;
  startEdit: () => void;
  anchorEl: null | HTMLElement;
  handleArchive: () => void;
  isSnapshot: boolean;
}

export const GoalHeader: React.FC<GoalHeaderProps> = ({
  goal,
  goals,
  setGoals,
  isEditing,
  editedText,
  setEditedText,
  handleSave,
  handleCancel,
  handleMenuClick,
  handleMenuClose,
  startEdit,
  anchorEl,
  handleArchive,
  isSnapshot,
}) => {
  const [confirm, setConfirm] = React.useState<boolean | null>(null);

  confirm && !isSnapshot && actihandleGoalDelete(goals, setGoals, goal.id);

  const archText = goal.archived ? 'Unarchive' : 'Archive';
  const menuItemSX = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexGrow: 1,

    m: 0,
    p: 1,
  };
  const textFieldIconBtnSX = {
    borderRadius: 0,
    p: 0,
    m: 0,
    height: '40px',
    width: '36px',
  };
  const menuIconSX = {
    mr: 0.5,
    height: '36px',
  };

  const conText = confirm === null ? 'Delete' : 'CONFIRM';

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
        pb: 0.5,
      }}
    >
      {isEditing ? (
        <>
          <IconButton
            onClick={handleCancel}
            aria-label="cancel edit"
            sx={{
              ...textFieldIconBtnSX,
              height: '56px',
            }}
          >
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
            }}
          />

          <IconButton
            onClick={handleSave}
            aria-label="save"
            sx={{
              ...textFieldIconBtnSX,

              height: '56px',
            }}
          >
            <SaveIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              width: '100%',
              pl: 0.75,
            }}
          >
            {goal.text}
          </Typography>

          <IconButton
            onClick={handleMenuClick}
            aria-label="menu"
            sx={{
              ...textFieldIconBtnSX,
              borderRadius: 0,
              borderTopRightRadius: 1,
              borderBottomRightRadius: 1,
            }}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{}}
          >
            {!goal.archived && (
              <MenuItem onClick={startEdit} sx={menuItemSX} disableGutters>
                <EditIcon
                  sx={{
                    ...menuIconSX,
                  }}
                />
                <Typography variant="body1">Edit</Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleArchive} sx={menuItemSX} disableGutters>
              {goal.archived ? (
                <UnarchiveIcon
                  fontSize="medium"
                  sx={{
                    ...menuIconSX,
                  }}
                />
              ) : (
                <ArchiveIcon
                  fontSize="medium"
                  sx={{
                    ...menuIconSX,
                  }}
                />
              )}
              <Typography variant="body1">{archText}</Typography>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirm(confirm === null ? false : true);
              }}
              sx={menuItemSX}
              disableGutters
            >
              <DeleteIcon sx={{ color: red[500], ...menuIconSX }} />
              <Typography variant="body1">{conText}</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default GoalHeader;
