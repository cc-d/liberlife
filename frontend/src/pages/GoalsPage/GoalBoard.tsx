import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { GoalOut } from '../../api';
import apios from '../../apios';
import GoalBoardElem from './GoalBoardElem';
import ShowHideTextButton from '../../components/ShowHideTooltip';
import { useThemeContext } from '../../contexts/ThemeContext';
import grey from '@mui/material/colors/grey';

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
  const { theme } = useThemeContext();

  let [newGoalText, setNewGoalText] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    () => (localStorage.getItem('sortOrder') as SortOrder) || SortOrder.Default
  );
  const [hideArchived, setHideArchived] = useState<boolean>(
    localStorage.getItem('hideArchived') === 'true'
  );
  const [currentGoals, setCurrentGoals] = useState<GoalOut[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalOut[]>([]);

  // Effect to update local storage whenever sortOrder changes
  useEffect(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  const handleSortClick = () => {
    const nextSortOrder =
      sortOrders[(sortOrders.indexOf(sortOrder) + 1) % sortOrders.length];
    setSortOrder(nextSortOrder);
  };

  const sortedGoals = useMemo(
    () => sortGoals(goals, sortOrder),
    [goals, sortOrder]
  );

  const handleAddGoal = async () => {
    if (newGoalText.trim()) {
      const response = await apios.post('/goals', { text: newGoalText });
      if (response.data) {
        setGoals([...goals, response.data]);
        setNewGoalText('');
      }
    }
  };

  useMemo(() => {
    setCurrentGoals(sortedGoals.filter((goal) => !goal.archived));

    !hideArchived &&
      setArchivedGoals(sortedGoals.filter((goal) => goal.archived));
  }, [sortedGoals, hideArchived]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'left',
          mb: 1,
          width: '100%',
          maxWidth: '100%',
        }}
      >
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

        {isSnapshot ? null : (
          <>
            <TextField
              variant="outlined"
              placeholder="New goal..."
              value={newGoalText}
              onChange={(e) =>
                e.target.value !== newGoalText && setNewGoalText(e.target.value)
              }
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
              size="small"
              variant="contained"
              color="primary"
              sx={{
                m: 0,

                maxWidth: '100%',
                minHeight: '100%',
              }}
              onClick={handleAddGoal}
            >
              Create
            </Button>
          </>
        )}
      </Box>

      <GoalBoardElem goals={currentGoals} setGoals={setCurrentGoals} />

      <Box p={0.5} m={0.5} mt={2}>
        <ShowHideTextButton
          text="Archived"
          hideArchived={hideArchived}
          setHideArchived={setHideArchived}
        />
      </Box>

      {!hideArchived && (
        <GoalBoardElem goals={archivedGoals} setGoals={setCurrentGoals} />
      )}
    </>
  );
};

export default GoalBoard;
