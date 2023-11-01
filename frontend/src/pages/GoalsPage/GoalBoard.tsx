import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { GoalOut } from "../../api";
import { GoalItem } from "./GoalItem";

interface GoalBoardProps {
  goals: GoalOut[];
  newGoalText: string;
  setNewGoalText: (text: string) => void;
  handleAddGoal: () => void;
  toggleTaskCompletion: (
    goalId: number,
    taskId: number,
    isCompleted: boolean
  ) => void;
  handleGoalDelete: (goalId: number) => void;
  handleAddTaskToGoal: (goalId: number, taskText: string) => void;
  handleGoalUpdate: (goalId: number, updatedText: string) => Promise<boolean>;
  handleDeleteTask: (goalId: number, taskId: number) => void;
}

const GoalBoard: React.FC<GoalBoardProps> = ({
  goals,
  newGoalText,
  setNewGoalText,
  handleAddGoal,
  toggleTaskCompletion,
  handleGoalDelete,
  handleAddTaskToGoal,
  handleGoalUpdate,
  handleDeleteTask,
}) => {
  const latestUpdatedOn = (goal: any) => {
    if (!goal?.tasks && goal.tasks?.length > 0) {
      return new Date(goal.updated_on);
    }

    console.log("latest", goal);

    if (!goal.task && goal.tasks?.length > 0) {
      let mostRecentGoal = new Date(goal.updated_on);

      let mostRecentTask = goal.tasks
        .map((task: any) => new Date(task.updated_on))
        .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];

      if (mostRecentTask.getTime() > mostRecentGoal.getTime()) {
        return mostRecentTask;
      } else {
        return mostRecentGoal;
      }
    }
  };

  return (
    <Box sx={{
      backgroundColor: 'black',
    }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
          flexDirection: "row",
          p: 0.5,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            maxWidth: "200px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Goals
        </Typography>

        <TextField
          variant="outlined"
          placeholder="New goal..."
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddGoal();
            }
          }}
          sx={{
            p: 0.5,
          }}
        />
        <Button
          variant="contained"
          color="primary"

          sx={{
            maxHeight: "56px",
            mt: 0.5,
          }}
          onClick={handleAddGoal}
        >
          Create
        </Button>
      </Box>

      <Divider
        sx={{
          backgroundColor: "#303030",
          height: "2px",
          mb: 1,
          ml: 0.5,
          mr: 0.5,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "left",
          m: 0.5,
        }}
      >
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onTaskToggle={toggleTaskCompletion}
            onGoalDelete={handleGoalDelete}
            onTaskAdd={handleAddTaskToGoal}
            onGoalUpdate={handleGoalUpdate}
            onTaskDelete={handleDeleteTask}
            mostRecentUpdate={latestUpdatedOn(goal)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default GoalBoard;
