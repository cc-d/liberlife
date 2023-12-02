import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import apios from '../utils/apios';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useThemeContext } from '../contexts/ThemeContext';
import { debounce } from '../utils/helpers';

export const GoalCreateBtn: React.FC<{
  newGoalText: string;
  setNewGoalText: React.Dispatch<React.SetStateAction<string>>;
  handleAddGoal: () => void;
  debouncedHandleTextChange: (val: string) => void;
}> = ({
  newGoalText,
  setNewGoalText,
  handleAddGoal,
  debouncedHandleTextChange,
}) => {
  const { theme } = useThemeContext();

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
          display: 'flex',

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
      >
        <ArrowDownIcon />
      </IconButton>
    </Box>
  );
};

export default GoalCreateBtn;
