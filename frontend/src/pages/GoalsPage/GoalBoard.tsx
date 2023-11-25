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
  isSnapshot?: boolean;
}

const GoalBoard: React.FC<GoalBoardProps> = ({
  goals,
  setGoals,
  isSnapshot = false,
}) => {
  const [newGoalText, setNewGoalText] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Default);
  const [hideArchived, setHideArchived] = useState<boolean>(false);

  // Load initial states from localStorage
  useEffect(() => {
    const storedSortOrder = localStorage.getItem('sortOrder') as SortOrder;
    const storedHideArchived = localStorage.getItem('hideArchived') === 'true';

    setSortOrder(storedSortOrder || SortOrder.Default);
    setHideArchived(storedHideArchived);
  }, []);

  // Update localStorage when sortOrder or hideArchived changes
  useEffect(() => {
    localStorage.setItem('sortOrder', sortOrder);
    localStorage.setItem('hideArchived', hideArchived.toString());
  }, [sortOrder, hideArchived]);

  // Memoize sorted goals
  const sortedGoals = useMemo(
    () => sortGoals(goals, sortOrder),
    [goals, sortOrder]
  );

  // Filter current and archived goals
  const currentGoals = sortedGoals.filter((goal) => !goal.archived);
  const archivedGoals = sortedGoals.filter((goal) => goal.archived);

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

  const toggleArchivedVisibility = () => {
    setHideArchived(!hideArchived);
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
            justifyContent: 'space-between',
            m: 0,
            flexGrow: 1,
            p: 0,
            height: '100%',
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
            {isSnapshot ? 'GOAL BOARD SNAPSHOT' : 'Goal Board'}
          </Typography>
          <SortButton sortOrder={sortOrder} onSort={handleSortClick} />
        </Box>

        {!isSnapshot ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              m: 0,
              p: 0,
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
        goals={currentGoals}
        setGoals={setGoals}
        isSnapshot={isSnapshot}
      />

      {/* Archived Goals */}
      {/* ... */}

      {/* Toggle Archived Goals Visibility */}
      <Box p={0.5} m={0.5} mt={2}>
        <ShowHideTextButton
          text="Archived"
          hideArchived={hideArchived}
          setHideArchived={toggleArchivedVisibility}
        />
      </Box>
      {!hideArchived && (
        <GoalBoardElem
          goals={archivedGoals}
          setGoals={setGoals}
          isSnapshot={isSnapshot}
        />
      )}
    </Box>
  );
};

export default GoalBoard;
