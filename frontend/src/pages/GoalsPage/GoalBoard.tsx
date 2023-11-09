import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SortIcon from "@mui/icons-material/Sort";
import { goalDateHelper } from "./helpers";
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
  const [sortOrder, setSortOrder] = useState<string>(
    localStorage.getItem("sortOrder") || "default"
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
    updatedNotes?: string | null
  ) => {
    return actionUpdateGoal(setGoals, goalId, updatedText, updatedNotes);
  };

  const handleDeleteTask = async (goalId: number, taskId: number) => {
    return actionDeleteTask(goals, setGoals, goalId, taskId);
  };

  // Function to perform the sorting based on the sortOrder state
  const sortGoalsFunction = () => {
    switch (sortOrder) {
      case "updated desc":
        return [...goals].sort((a, b) => goalDateHelper(a) - goalDateHelper(b));
      case "updated asc":
        return [...goals].sort((a, b) => goalDateHelper(b) - goalDateHelper(a));
      default:
        return goals; // return the original array if 'default' is selected
    }
  };

  const sortedGoals = sortGoalsFunction();

  // Handler to cycle through the sort orders
  const handleSortClick = () => {
    setSortOrder((prevSortOrder) => {
      switch (prevSortOrder) {
        case "default":
          localStorage.setItem("sortOrder", "updated asc");
          return "updated asc";
        case "updated asc":
          localStorage.setItem("sortOrder", "updated desc");
          return "updated desc";
        case "updated desc":
          localStorage.setItem("sortOrder", "default");
          return "default";
        default:
          localStorage.setItem("sortOrder", "default");
          return "default";
      }
    });
  };

  // Determine which icon to show
  const SortIconComponent =
    sortOrder === "updated asc"
      ? ArrowUpwardIcon
      : sortOrder === "updated desc"
      ? ArrowDownwardIcon
      : SortIcon;

  return (
    <Box
      sx={{
        backgroundColor: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "left",
          justifyContent: "left",
          flexDirection: "row",
          p: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column",
            p: 0,
            m: 0,
            pl: 0.5,
            pr: 0.5,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              minWidth: "8rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            Goal Board
          </Typography>

          <Box
            className="sort-container"
            sx={{
              display: "flex",
              flexDirection: "row",
              m: 0,
              p: 0,
              minWidth: "100px",
            }}
          >
            <IconButton onClick={handleSortClick} aria-label="sort goals">
              <Typography
                variant="h6"
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  minWidth: "2rem",
                  m: 0,
                  p: 0,
                }}
              >
                sort: {sortOrder.split(" ")[0]}
              </Typography>
              <SortIconComponent
                sx={{
                  fontSize: "1rem",
                  m: 0,
                  p: 0,
                  minWidth: "2rem",
                }}
              />
            </IconButton>
          </Box>
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
