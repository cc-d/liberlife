import React from 'react';
import { Box, Divider } from '@mui/material';
import { GoalOut } from '../../api';
import GoalItem from './GoalItem';
import { actionUpdateGoal, actihandleGoalDelete } from './actions';

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
    : async (goalId: number) => {
        return actihandleGoalDelete(goals, setGoals, goalId);
      };

  const handleGoalUpdate = isSnapshot
    ? () => {}
    : async (
        goalId: number,
        updatedText?: string,
        updatedNotes?: string | null,
        archived?: boolean
      ) => {
        return actionUpdateGoal(
          setGoals,
          goalId,
          updatedText,
          updatedNotes,
          archived
        );
      };

  return (
    <>
      <Divider className="gboard-divider" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'left',
          m: 0,
          p: 0,
          mt: 1,
        }}
      >
        {goals.map((goal: GoalOut) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            goals={goals}
            setGoals={setGoals}
            handleGoalUpdate={handleGoalUpdate}
            handleGoalDelete={handleGoalDelete}
          />
        ))}
      </Box>
    </>
  );
};

export default GoalBoardElem;
