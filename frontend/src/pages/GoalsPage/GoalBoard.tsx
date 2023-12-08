import React, { useState, useMemo } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { GoalOut } from '../../api';
import apios from '../../utils/apios';
import GoalBoardElem from './GoalBoardElem';
import SortButton, {
  SortOrder,
  sortGoals,
  sortOrders,
} from '../../components/SortButton';
import GoalCreateBtn from '../../components/GoalCreateBtn';
import { debounce } from '../../utils/helpers';
import { GBoardTypes } from '.';

interface GoalBoardProps {
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  boardType: string;
}

const GoalBoard: React.FC<GoalBoardProps> = ({
  goals,
  setGoals,
  boardType,
}) => {
  const [newGoalText, setNewGoalText] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (localStorage.getItem('sortOrder') as SortOrder) || SortOrder.Default
  );
  const isArchived = boardType === GBoardTypes.archived;
  const isSnapshot = boardType === GBoardTypes.snapshot;

  // eslint-disable-next-line
  const toggleSortOrder = useMemo(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  // Memoize sorted goals
  const sortedGoals = useMemo(
    () =>
      sortGoals(
        goals.filter((goal) => goal.archived === isArchived),
        sortOrder
      ),
    // eslint-disable-next-line
    [sortOrder, goals]
  );

  const handleSortClick = () => {
    const nextSortOrder =
      sortOrders[(sortOrders.indexOf(sortOrder) + 1) % sortOrders.length];
    setSortOrder(nextSortOrder);
  };

  const handleAddGoal = async (useText?: string) => {
    if (useText || newGoalText.trim()) {
      const sendText = useText || newGoalText.trim();
      const response = await apios.post('/goals', { text: sendText });
      if (response.data) {
        setGoals((prevGoals) => [...prevGoals, response.data]);
        setNewGoalText('');
      }
    }
  };

  const handleTextChange = (val: string, submit?: boolean) => {
    if (submit) {
      handleAddGoal(val);
    } else {
      setNewGoalText(val);
    }
  };

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
              ? 'Snapshot'
              : isArchived
              ? 'Archived'
              : boardType === GBoardTypes.demo
              ? 'Demo'
              : 'Goals'}
          </Typography>
          <SortButton sortOrder={sortOrder} onSort={handleSortClick} />
        </Box>

        {!isSnapshot && !isArchived ? (
          <GoalCreateBtn
            newGoalText={newGoalText}
            setNewGoalText={setNewGoalText}
            handleAddGoal={handleAddGoal}
            handleTextChange={debounce(handleTextChange, 0)}
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
