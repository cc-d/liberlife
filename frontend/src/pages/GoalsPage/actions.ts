import React from "react";
import apios from "../../apios";
import { GoalOut, GoalTaskOut } from "../../api";

export const actionUpdateGoal = async (
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>,
  goalId: number,
  updatedText?: string,
  updatedNotes?: string | null,
  archived?: boolean
) => {
  try {
    let endpoint = `/goals/${goalId}`;
    let payload: any = {};

    if (updatedNotes !== undefined) {
      endpoint += `/notes`;
      payload.notes = updatedNotes;
    } else if (updatedText !== undefined) {
      payload.text = updatedText;
    } else if (archived !== undefined) {
      payload.archived = archived;
    }

    const response = await apios.put(endpoint, payload);

    if (response.status === 200) {
      setGoals((prevGoals) =>
        prevGoals.map((g) => {
          if (g.id !== goalId) return g;
          if (updatedText !== undefined) return { ...g, text: updatedText };
          if (archived !== undefined) return { ...g, archived: archived };
          if (updatedNotes !== undefined) return { ...g, notes: updatedNotes };
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

export const actihandleGoalDelete = async (
  goals: GoalOut[],
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>,
  goalId: number
) => {
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

export const actionAddTaskToGoal = async (
  goals: GoalOut[],
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>,
  goalId: number,
  taskText: string
) => {
  try {
    const response = await apios.post<GoalTaskOut>(`/goals/${goalId}/tasks`, {
      text: taskText,
    });
    if (response.data) {
      setGoals(
        goals.map((goal) => {
          if (goal.id === goalId) {
            const updatedTasks = goal.tasks
              ? [...goal.tasks, response.data]
              : [response.data];
            return {
              ...goal,
              updated_on: response.data.updated_on,
              tasks: updatedTasks,
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

export const actionDeleteTask = async (
  goals: GoalOut[],
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>,
  goalId: number,
  taskId: number
) => {
  try {
    const response = await apios.delete(`/goals/${goalId}/tasks/${taskId}`);
    if (response.data) {
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

export const actionTaskCompletion = async (
  goals: GoalOut[],
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>,
  goalId: number,
  taskId: number,
  isCompleted: boolean
) => {
  try {
    const response = await apios.put(`/goals/${goalId}/tasks/${taskId}`, {
      completed: !isCompleted,
    });
    if (response.data) {
      setGoals(
        goals.map((goal) => {
          if (goal.id === goalId && goal.tasks) {
            goal.updated_on = response.data.updated_on;
            goal.tasks = goal.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  completed: !isCompleted,
                };
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
