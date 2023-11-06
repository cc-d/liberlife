import React, { useState, useEffect, useContext } from "react";
import { Container } from "@mui/material";
import apios from "../../apios";
import { GoalOut, GoalTaskOut } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import GoalBoard from "./GoalBoard";
import {actionUpdateGoal,
  actionDeleteTask,
  actionAddTaskToGoal,
  actionTaskCompletion,
  actionGoalDelete,
} from "./actions";

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
    <Container
      maxWidth={false}
      sx={{
        m: 0,
        p: 0,
        backgroundColor: "black",
      }}
    >
      <GoalBoard
        goals={goals}
        setGoals={setGoals}
        newGoalText={newGoalText}
        setNewGoalText={setNewGoalText}
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
