import React, { useState, useEffect, useMemo } from "react";
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
  actihandleGoalDelete,
} from "./actions";

import SortButton, {
  SortOrder,
  sortGoals,
  sortOrders,
} from "./SortButton";
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
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    () => (localStorage.getItem("sortOrder") as SortOrder) || SortOrder.Default
  );

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
    return actionTaskCompletion(goals, setGoals, goalId, taskId, isCompleted);
  };
  const handleAddTaskToGoal = async (goalId: number, taskText: string) => {
    return actionAddTaskToGoal(goals, setGoals, goalId, taskText);
  };

  const handleGoalDelete = async (goalId: number) => {
    return actihandleGoalDelete(goals, setGoals, goalId);
  };

  const handleGoalUpdate = async (
    goalId: number,
    updatedText?: string,
    updatedNotes?: string | null,
    archived?: boolean
  ) => {
    return actionUpdateGoal(setGoals, goalId, updatedText, updatedNotes, archived);
  };

  const handleDeleteTask = async (goalId: number, taskId: number) => {
    return actionDeleteTask(goals, setGoals, goalId, taskId);
  };

  // Effect to update local storage whenever sortOrder changes
  useEffect(() => {
    localStorage.setItem("sortOrder", sortOrder);
  }, [sortOrder]);

  const handleSortClick = () => {
    const nextSortOrder =
      sortOrders[(sortOrders.indexOf(sortOrder) + 1) % sortOrders.length];
    setSortOrder(nextSortOrder);
  };

  const sortedGoals = useMemo(() => sortGoals(goals, sortOrder), [
    goals,
    sortOrder,
  ]);

  return (
    <Box
      sx={{
        backgroundColor: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "left",
          m: 0,
          p: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
              userSelect: "none",
              pr: 0.5,
            }}
          >
            Goal Board
          </Typography>
          <SortButton sortOrder={sortOrder} onSort={handleSortClick} />
        </Box>

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
        {sortedGoals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            toggleTaskCompletion={toggleTaskCompletion}
            handleGoalDelete={handleGoalDelete}
            handleAddTaskToGoal={handleAddTaskToGoal}
            handleGoalUpdate={handleGoalUpdate}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
      </Box>
    </Box>
  );
};

export default GoalBoard;
