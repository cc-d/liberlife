import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import apios from "../../apios";
import { GoalOut, GoalTaskOut } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { GoalItem } from "./GoalItem";

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalOut[]>([]);
  const [newGoalText, setNewGoalText] = useState<string>("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
      return;
    }

    const fetchGoals = async () => {
      try {
        const response = await apios.get("/goals");
        setGoals(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          auth.logout();
          navigate("/login");
        }
      }
    };

    fetchGoals();
  }, [auth, navigate]);

  const handleAddGoal = async () => {
    if (newGoalText.trim()) {
      const response = await apios.post("/goals", { text: newGoalText });
      if (response.data) {
        setGoals([...goals, response.data]);
        setNewGoalText("");
      }
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for user's authentication status
        // For this example, we're simply checking if a token exists.
        if (!localStorage.getItem("token")) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const toggleTaskCompletion = async (
    goalId: number,
    taskId: number,
    isCompleted: boolean
  ) => {
    try {
      const response = await apios.put(`/goals/${goalId}/tasks/${taskId}`, {
        completed: !isCompleted,
      });
      if (response.status === 200) {
        setGoals(
          goals.map((goal) => {
            if (goal.id === goalId && typeof goal.tasks !== "undefined") {
              goal.tasks.map((task) => {
                if (task.id === taskId) {
                  task.completed = !isCompleted;
                }
                return task;
              });
            }
            return goal;
          })
        );
      }
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleAddTaskToGoal = async (goalId: number, taskText: string) => {
    try {
      const response = await apios.post(`/goals/${goalId}/tasks`, {
        text: taskText,
      });
      if (response.data) {
        setGoals(
          goals.map((goal) => {
            if (goal.id === goalId) {
              if (goal.tasks) {
                goal.tasks.push(response.data);
              } else {
                goal.tasks = [response.data];
              }
            }
            return goal;
          })
        );
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  const handleGoalDelete = async (goalId: number) => {
    try {
      const response = await apios.delete(`/goals/${goalId}`);
      if (response.status === 200 || response.status === 204) {
        // Assuming a successful delete returns 200 or 204 status
        setGoals(goals.filter((goal) => goal.id !== goalId));
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <Box sx={{

      display: "flex",
      flexDirection: "column",
      alignItems: "center",
     }
    }>
      <Box>
      <TextField
        variant="outlined"
        placeholder="New goal..."
        value={newGoalText}
        onChange={(e) => setNewGoalText(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleAddGoal}>
        Create Goal
      </Button>
      </Box>

      <List>
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onTaskToggle={toggleTaskCompletion}
            onGoalDelete={handleGoalDelete}
            onTaskAdd={handleAddTaskToGoal}
          />
        ))}
      </List>
    </Box>
  );
};

export default GoalsPage;
