import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  Container,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import apios from "../../apios";
import { GoalOut, GoalTaskOut } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { GoalItem } from "./GoalItem";
import GoalBoard from "./GoalBoard";

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalOut[]>([]);
  const [newGoalText, setNewGoalText] = useState<string>("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth?.userLoading && !auth?.user) {
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
      const response = await apios.post<GoalTaskOut>(`/goals/${goalId}/tasks`, {
        text: taskText,
      });
      if (response.status === 200 && response.data && response.data !== null) {
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
    // prompt user if they are sure and only delete if so
    const confirmed = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmed) {
      return;
    }
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

  const handleGoalUpdate = async (goalId: number, updatedText: string) => {
    try {
      const response = await apios.put(`/goals/${goalId}`, { text: updatedText });
      if (response.status === 200) {
        setGoals((prevGoals) =>
          prevGoals.map((g) => (g.id === goalId ? { ...g, text: updatedText } : g))
        );
        return true;
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
    return false;
  };

  const handleDeleteTask = async (goalId: number, taskId: number) => {
    if (!auth || !auth?.userLoading && !auth?.user) {
      navigate("/login");
      return;
    }
    try {
      // Call the DELETE endpoint for the task.
      // I'm assuming the endpoint URL structure based on your provided routes for goals. Modify if it's different.
      const response = await apios.delete(`/goals/${goalId}/tasks/${taskId}`);

      if (response.status === 200 || response.status === 204) {
        // If successful, update the goals state to remove the task.
        setGoals((prevGoals) =>
          prevGoals.map((goal) => {
            if (goal.id === goalId) {
              return {
                ...goal,
                tasks: goal.tasks?.filter((task) => task.id !== taskId) || [],
              };
            }
            return goal;
          })
        );
      } else {
        console.error("Error deleting task:", response.data);
      }
    } catch (error: any) {
      const axiosError = error;
      if (axiosError.response && axiosError.response.status === 401) {
        auth.logout();
        navigate("/login");
      } else {
        console.error("Error deleting task:", error.message);
      }
    }
  };



  return (
    <Container
        maxWidth={false}
        sx={{
          m: 0,
        }}
      >
      <GoalBoard
        goals={goals}
        newGoalText={newGoalText}
        setNewGoalText={setNewGoalText}
        handleAddGoal={handleAddGoal}
        toggleTaskCompletion={toggleTaskCompletion}
        handleGoalDelete={handleGoalDelete}
        handleAddTaskToGoal={handleAddTaskToGoal}
        handleGoalUpdate={handleGoalUpdate}
        handleDeleteTask={handleDeleteTask}
      />
      </Container>

  );
};

export default GoalsPage;
