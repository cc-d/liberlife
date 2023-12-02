import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useThemeContext } from '../contexts/ThemeContext';
import { debounce } from '../utils/helpers';

export const GoalCreateBtn: React.FC<{
  newGoalText: string;
  setNewGoalText: React.Dispatch<React.SetStateAction<string>>;
  handleAddGoal: () => void;
  debouncedHandleTextChange: (val: string) => void;
  handleTextChange: (val: string, submit?: boolean) => void;
}> = ({
  newGoalText,
  setNewGoalText,
  handleAddGoal,
  debouncedHandleTextChange,
  handleTextChange,
}) => {
  const { theme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTodayDate = () => {
    const today = new Date();
    const formattedDate = `${today.toLocaleString('default', {
      month: 'short',
    })} ${today.getDate()}, ${today.getFullYear()}`;

    // Set the new goal text with the formatted date
    setNewGoalText(formattedDate);

    // Close the menu
    handleClose();

    return formattedDate;
  };

  const textFieldSX = {
    m: 0,
    p: 0,
    py: '17px',
    px: '14px',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        m: 0,
        p: 0,
        mb: 1,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="New goal..."
        value={newGoalText}
        onChange={(e) => debouncedHandleTextChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddGoal();
          } else if (e.key === 'Escape') {
            setNewGoalText('');
          }
        }}
        sx={{
          borderRadius: 0,
          borderTopLeftRadius: 1,
          borderBottomLeftRadius: 1,
        }}
      />
      <Button
        variant="contained"
        sx={{
          ...textFieldSX,
          borderRadius: 0,
          borderTopLeftRadius: 1,
        }}
        onClick={handleAddGoal}
      >
        New
      </Button>
      <IconButton
        sx={{
          ...textFieldSX,
          pl: 0.5,
          pr: 0.5,
          backgroundColor: theme.palette.secondary.main,
          borderRadius: 0,
          borderBottomRightRadius: 1,
          borderTopRightRadius: 1,
        }}
        onClick={handleClick}
      >
        <ArrowDownIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleTextChange(handleTodayDate(), true);
            handleAddGoal();
          }}
        >
          today's date
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default GoalCreateBtn;
