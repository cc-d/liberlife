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
import apios from "../../apios";
import {
  actionUpdateGoal,
  actionDeleteTask,
  actionAddTaskToGoal,
  actionTaskCompletion,
  actionGoalDelete,
} from "./actions";

interface GoalBoardProps {
  goals: GoalOut[];
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>;
  newGoalText: string;
  setNewGoalText: (text: string) => void;
}

const GoalBoard: React.FC<GoalBoardProps> = ({
  goals,
  setGoals,
  newGoalText,
  setNewGoalText,
}) => {

  const handleAddGoal = async () => {
    if (newGoalText.trim()) {
      const response = await apios.post("/goals", { text: newGoalText });
      if (response.data) {
        setGoals([...goals, response.data]);
        setNewGoalText("");
      }
    }
  };

  const toggleTaskCompletion = async (
    goalId: number,
    taskId: number,
    isCompleted: boolean
  ) => {
    return actionTaskCompletion(goals, setGoals, goalId, taskId, isCompleted)
  };
  const handleAddTaskToGoal = async (goalId: number, taskText: string) => {
    return actionAddTaskToGoal(goals, setGoals, goalId, taskText)
  };

  const handleGoalDelete = async (goalId: number) => {
    return actionGoalDelete(goals, setGoals, goalId)
  };

  const handleGoalUpdate = async (
    goalId: number,
    updatedText?: string,
    updatedNotes?: string | null
  ) => {
    return actionUpdateGoal(setGoals, goalId, updatedText, updatedNotes)
  };

  const handleDeleteTask = async (goalId: number, taskId: number) => {
    return actionDeleteTask(goals, setGoals, goalId, taskId)
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
          Goal Board
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
          />
        ))}
      </Box>
    </Box>
  );
};

export default GoalBoard;
