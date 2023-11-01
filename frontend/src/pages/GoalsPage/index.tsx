import React, { useState, useEffect, useContext } from "react";
import { Container } from "@mui/material";
import apios from "../../apios";
import { GoalOut, GoalTaskOut } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
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
      if (response.data && response.data.updated_on) {
        setGoals(
          goals.map((goal) => {
            if (goal.id === goalId && goal.tasks) {
              goal.tasks = goal.tasks.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    completed: !isCompleted,
                    updated_on: response.data.updated_on,
                  };
                }
                return task;
              });
              goal.updated_on = response.data.updated_on;
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
      if (response.data && response.data.updated_on) {
        setGoals(
          goals.map((goal) => {
            if (goal.id === goalId) {
              const updatedTasks = goal.tasks
                ? [...goal.tasks, response.data]
                : [response.data];
              return {
                ...goal,
                tasks: updatedTasks,
                updated_on: response.data.updated_on,
              };
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );
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

  const handleGoalUpdate = async (
    goalId: number,
    updatedText?: string,
    updatedNotes?: string | null
  ) => {
    try {
      let endpoint = `/goals/${goalId}`;
      let payload: any = {};

      if (updatedText !== undefined) {
        payload.text = updatedText;
      } else if (updatedNotes !== undefined) {
        endpoint += `/notes`;
        payload.notes = updatedNotes;
      }

      const response = await apios.put(endpoint, payload);

      if (response.status === 200) {
        setGoals((prevGoals) =>
          prevGoals.map((g) => {
            if (g.id !== goalId) return g;
            if (updatedText !== undefined) return { ...g, text: updatedText };
            if (updatedNotes !== undefined)
              return { ...g, notes: updatedNotes };
            return g;
          })
        );
        return true;
      }
    } catch (error) {
      console.error(
        `Error updating goal ${updatedText ? "text" : "notes"}:`,
        error
      );
    }
    return false;
  };

  const handleDeleteTask = async (goalId: number, taskId: number) => {
    try {
      const response = await apios.delete(`/goals/${goalId}/tasks/${taskId}`);
      if (response.data && response.data.updated_on) {
        setGoals(
          goals.map((goal) => {
            if (goal.id === goalId) {
              const updatedTasks = goal.tasks?.filter(
                (task) => task.id !== taskId
              );
              return {
                ...goal,
                tasks: updatedTasks,
                updated_on: response.data.updated_on,
              };
            }
            return goal;
          })
        );
      } else {
        console.error(
          "Delete operation successful but unexpected response format: ",
          response.data
        );
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
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
