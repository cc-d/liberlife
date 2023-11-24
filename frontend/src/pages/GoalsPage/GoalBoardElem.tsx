import React from "react";
import { Box, Divider } from "@mui/material";
import { GoalOut } from "../../api";
import { GoalItem } from "./GoalItem";

interface GoalBoardElemProps {
  goals: GoalOut[];
  handleGoalDelete?: any;
  handleAddTaskToGoal?: any;
  handleGoalUpdate?: any;
  handleDeleteTask?: any;
  handleTaskStatus: Function;
  isSnapshot?: boolean;
}

export const GoalBoardElem: React.FC<GoalBoardElemProps> = ({
  goals,
  handleGoalDelete,
  handleAddTaskToGoal,
  handleGoalUpdate,
  handleDeleteTask,
  handleTaskStatus: handleTaskStatus,
  isSnapshot = false,
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
        {goals.map((goal: GoalOut) =>
          isSnapshot ? (
            <GoalItem
              key={goal.id}
              goal={goal}
              handleGoalDelete={() => {}}
              handleAddTaskToGoal={() => {}}
              handleGoalUpdate={() => {}}
              handleDeleteTask={() => {}}
              handleTaskStatus={() => {}}
            />
          ) : (
            <GoalItem
              key={goal.id}
              goal={goal}
              handleGoalDelete={handleGoalDelete}
              handleAddTaskToGoal={handleAddTaskToGoal}
              handleGoalUpdate={handleGoalUpdate}
              handleDeleteTask={handleDeleteTask}
              handleTaskStatus={handleTaskStatus}
            />
          )
        )}
      </Box>
    </>
  );
};

export default GoalBoardElem;
