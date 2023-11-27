import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort'; // This is the default icon for 'Sort'
import FilterListIcon from '@mui/icons-material/FilterList'; // New icon for 'Default'
import { GoalOut } from '../../api';
import theme from '../../app/theme';
export interface SortIconMapping {
  icon: React.ElementType;
  label: string;
}

export enum SortOrder {
  Default = 'default',
  UpdatedAsc = 'updated asc',
  UpdatedDesc = 'updated desc',
  AlphabeticalAsc = 'a-z',
  AlphabeticalDesc = 'z-a',
}

export const convertOnTime = (goal: GoalOut): number => {
  return new Date(goal.updated_on).getTime();
};

export const sortGoals = (
  goals: GoalOut[],
  sortOrder: SortOrder
): GoalOut[] => {
  switch (sortOrder) {
    case SortOrder.UpdatedAsc:
      return [...goals].sort(
        (a: GoalOut, b: GoalOut) => convertOnTime(a) - convertOnTime(b)
      );
    case SortOrder.UpdatedDesc:
      return [...goals].sort(
        (a: GoalOut, b: GoalOut) => convertOnTime(b) - convertOnTime(a)
      );
    case SortOrder.AlphabeticalAsc:
      return [...goals].sort((a, b) => a.text.localeCompare(b.text));
    case SortOrder.AlphabeticalDesc:
      return [...goals].sort((a, b) => b.text.localeCompare(a.text));
    default:
      return goals;
  }
};

export const sortOrders: SortOrder[] = [
  SortOrder.Default,
  SortOrder.UpdatedAsc,
  SortOrder.UpdatedDesc,
  SortOrder.AlphabeticalAsc,
  SortOrder.AlphabeticalDesc,
];

export const sortIconAndLabel = (sortOrder: SortOrder): SortIconMapping => {
  switch (sortOrder) {
    case SortOrder.UpdatedAsc:
      return { icon: ArrowUpwardIcon, label: 'Updated' };
    case SortOrder.UpdatedDesc:
      return { icon: ArrowDownwardIcon, label: 'Updated' };
    case SortOrder.AlphabeticalAsc:
      return { icon: ArrowDownwardIcon, label: 'A-Z' };
    case SortOrder.AlphabeticalDesc:
      return { icon: ArrowUpwardIcon, label: 'A-Z' };
    case SortOrder.Default:
    default:
      return { icon: FilterListIcon, label: 'Default' }; // New icon for 'Default'
  }
};

interface SortButtonProps {
  sortOrder: SortOrder;
  onSort: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOrder, onSort }) => {
  const { icon: SortIconComponent, label } = sortIconAndLabel(sortOrder);

  return (
    <Box
      sx={{
        display: 'flex',
        m: 0,
        p: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      {/* Static 'Sort' icon and text */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          m: 0,
          p: 0,
          flexDirection: 'row',
          mr: 1,
        }}
      >
        <SortIcon sx={{ fontSize: '1rem', m: 0 }} />
        <Typography variant="subtitle2" sx={{ m: 0, p: 0, userSelect: 'none' }}>
          sort
        </Typography>
      </Box>

      {/* Clickable sort order and icon */}
      <Button onClick={onSort} sx={{ textTransform: 'none', m: 0, p: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            userSelect: 'none',
            m: 0,
            p: 0,
            color: theme.palette.primary.main,
          }}
        >
          {label}
        </Typography>
        <SortIconComponent sx={{ fontSize: '1rem', m: 0, p: 0 }} />
      </Button>
    </Box>
  );
};

export default SortButton;
