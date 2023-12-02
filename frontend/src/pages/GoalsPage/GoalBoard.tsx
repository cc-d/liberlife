import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import { GoalOut } from '../../api';
import apios from '../../utils/apios';
import GoalBoardElem from './GoalBoardElem';
import ShowHideTextButton from '../../components/ShowHideTooltip';
import { debounce } from '../../utils/helpers';
import SortButton, {
  SortOrder,
  sortGoals,
  sortOrders,
} from '../../components/SortButton';
import GoalCreateBtn from '../../components/GoalCreateBtn';

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

  const toggleSortOrder = useMemo(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  // Memoize sorted goals
  const sortedGoals = useMemo(
    () =>
      sortGoals(
        goals.filter((goal) => goal.archived === archived),
        sortOrder
      ),
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

  const handleTextChange = (val: string, submit: boolean = false) => {
    setNewGoalText(val);
    if (submit) {
      handleAddGoal();
    }
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
          <GoalCreateBtn
            newGoalText={newGoalText}
            setNewGoalText={setNewGoalText}
            handleAddGoal={handleAddGoal}
            debouncedHandleTextChange={debouncedHandleTextChange}
            handleTextChange={handleTextChange}
          />
        ) : null}
      </Box>
      <Divider sx={{ mb: 1 }} />
      <GoalBoardElem
        goals={sortedGoals}
        setGoals={setGoals}
        isSnapshot={isSnapshot}
      />
    </Box>
  );
};

export default GoalBoard;
