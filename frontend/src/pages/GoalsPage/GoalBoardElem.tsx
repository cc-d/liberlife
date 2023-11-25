import React from "react";
import { Box, Divider } from "@mui/material";
import { GoalOut } from "../../api";
import { GoalItem } from "./GoalItem";
import {
  actionUpdateGoal,
  actionDeleteTask,
  actionAddTaskToGoal,
  actihandleGoalDelete,
  actionTaskStatus,
} from "./actions";

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
  const handleAddTaskToGoal = async (goalId: number, taskText: string) => {
    return actionAddTaskToGoal(goals, setGoals, goalId, taskText);
  };

  const handleGoalDelete = async (goalId: number) => {
    return actihandleGoalDelete(goals, setGoals, goalId);
  };

  const handleTaskStatus = async (goalId: number, taskId: number) => {
    return actionTaskStatus(goalId, taskId, goals, setGoals);
  };

  const handleGoalUpdate = async (
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

  const handleDeleteTask = async (goalId: number, taskId: number) => {
    return actionDeleteTask(goals, setGoals, goalId, taskId);
  };

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
