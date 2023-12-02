import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { GoalOut } from '../../api';
import apios from '../../utils/apios';
import GoalBoardElem from './GoalBoardElem';
import ShowHideTextButton from '../../components/ShowHideTooltip';
import { debounce } from '../../utils/helpers';
import SortButton, { SortOrder, sortGoals, sortOrders } from './SortButton';

interface GoalBoardProps {
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  archived: boolean;
  isSnapshot?: boolean;
}

const GoalBoard: React.FC<GoalBoardProps> = ({
  goals,
  setGoals,
  archived,
  isSnapshot = false,
}) => {
  const [newGoalText, setNewGoalText] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (localStorage.getItem('sortOrder') as SortOrder) || SortOrder.Default
  );

  const archGoals = useMemo(
    () => goals.filter((goal) => goal.archived === archived),
    [goals]
  );

  const toggleSortOrder = useMemo(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  // Memoize sorted goals
  const sortedGoals = useMemo(
    () => sortGoals(archGoals, sortOrder),
    [sortOrder, goals]
  );

  const handleSortClick = () => {
    const nextSortOrder =
      sortOrders[(sortOrders.indexOf(sortOrder) + 1) % sortOrders.length];
    setSortOrder(nextSortOrder);
  };

  const handleAddGoal = async () => {
    if (newGoalText.trim()) {
      const response = await apios.post('/goals', { text: newGoalText });
      if (response.data) {
        setGoals((prevGoals) => [...prevGoals, response.data]);
        setNewGoalText('');
      }
    }
  };

  const handleTextChange = (val: string) => {
    setNewGoalText(val);
  };

  const debouncedHandleTextChange = useMemo(
    () => debounce(handleTextChange, 1),
    []
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '60px',
            m: 0,
            flexGrow: 1,
            p: 0,
          }}
        >
          <Typography
            variant="h5"
            noWrap
            sx={{
              m: 0,
              p: 0,
              userSelect: 'none',
            }}
          >
            {isSnapshot
              ? 'Goals Snapshot'
              : archived
              ? 'Archived Goals'
              : 'Goals'}
          </Typography>
          <SortButton sortOrder={sortOrder} onSort={handleSortClick} />
        </Box>

        {!isSnapshot && !archived ? (
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
                m: 0,
                p: 0,
                ml: 0.5,
              }}
            />
            <Button
              variant="contained"
              sx={{
                height: '100%',
                pt: 2,
                pb: 2,
              }}
              onClick={handleAddGoal}
            >
              Create
            </Button>
          </Box>
        ) : null}
      </Box>
      {/* Actual GoalBoard */}
      <GoalBoardElem
        goals={sortedGoals}
        setGoals={setGoals}
        isSnapshot={isSnapshot}
      />
    </Box>
  );
};

export default GoalBoard;
