import React from 'react';
import { Box, Divider } from '@mui/material';
import { GoalOut } from '../../api';
import GoalItem from './GoalItem';
import { actionUpdateGoal, actihandleGoalDelete } from '../../utils/actions';

interface GoalBoardElemProps {
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  isSnapshot?: boolean;
}

export const GoalBoardElem: React.FC<GoalBoardElemProps> = ({
  goals,
  setGoals,
  isSnapshot = false,
}) => {
  const handleGoalDelete = isSnapshot
    ? () => {}
    : (goalId: number) => actihandleGoalDelete(goals, setGoals, goalId);
  const handleGoalUpdate = isSnapshot
    ? () => {}
    : (
        goalId: number,
        updatedText?: string,
        updatedNotes?: string | null,
        archived?: boolean,
        tasksLocked?: boolean
      ) =>
        actionUpdateGoal(
          setGoals,
          goalId,
          updatedText,
          updatedNotes,
          archived,
          tasksLocked
        );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'left',
        mt: 1,
      }}
    >
      {goals &&
        goals?.map &&
        goals.map((goal: GoalOut) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            goals={goals}
            setGoals={setGoals}
            handleGoalUpdate={handleGoalUpdate}
            isSnapshot={isSnapshot}
          />
        ))}
    </Box>
  );
};

export default GoalBoardElem;
