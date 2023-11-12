import React from "react";
import { Box, Divider } from "@mui/material";
import { GoalOut } from "../../api";
import { GoalItem } from "./GoalItem";
import ShowHideTextButton from "../../components/ShowHideTooltip";

interface GoalBoardElemProps {
  goals: GoalOut[];
  toggleTaskCompletion?: any;
  handleGoalDelete?: any;
  handleAddTaskToGoal?: any;
  handleGoalUpdate?: any;
  handleDeleteTask?: any;
  isArchived: boolean;
}

export const GoalBoardElem: React.FC<GoalBoardElemProps> = ({
  goals,
  toggleTaskCompletion,
  handleGoalDelete,
  handleAddTaskToGoal,
  handleGoalUpdate,
  handleDeleteTask,
  isArchived = false,
}) => {
  return (
    <>
      <Divider className="gboard-divider" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "left",
          m: 0,
          p: 0,
          mt: 1,
        }}
      >
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            toggleTaskCompletion={isArchived ? undefined : toggleTaskCompletion}
            handleGoalDelete={isArchived ? undefined : handleGoalDelete}
            handleAddTaskToGoal={isArchived ? undefined : handleAddTaskToGoal}
            handleGoalUpdate={isArchived ? undefined : handleGoalUpdate}
            handleDeleteTask={isArchived ? undefined : handleDeleteTask}
          />
        ))}
      </Box>
    </>
  );
};

export default GoalBoardElem;
