import React from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
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
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
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
          sx={{ mr: 2 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddGoal();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={handleAddGoal}
        >
          Create Goal
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
          mr: 1,
          mb: 1,
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
          />
        ))}
      </Box>
    </Box>
  );
};

export default GoalBoard;
