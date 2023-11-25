import React from 'react';
import apios from '../../utils/apios';
import { GoalOut, GoalTaskOut, TaskStatus } from '../../api';

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
      `Error updating goal ${updatedText ? 'text' : 'notes'}:`,
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
  const confirmed = window.confirm(
    'Are you sure you want to delete this goal?'
  );
  if (!confirmed) {
    return;
  }
  try {
    const response = await apios.delete(`/goals/${goalId}`);
    if (response.status === 200 || response.status === 204) {
      setGoals(goals.filter((goal) => goal.id !== goalId));
    }
  } catch (error) {
    console.error('Error deleting goal:', error);
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
    console.error('Error adding task:', error);
  }
};

export const actionDeleteTask = async (
  goals: GoalOut[],
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>,
  goalId: number,
  taskId: number
) => {
  const response = await apios.delete(`/goals/${goalId}/tasks/${taskId}`);
  return response;
};

export const actionTaskStatus = async (
  goalId: number,
  taskId: number,
  goals: GoalOut[],
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>
) => {
  const originalGoals = goals;
  setGoals(
    goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks?.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              status:
                task.status === TaskStatus.NOT_STARTED
                  ? TaskStatus.IN_PROGRESS
                  : task.status === TaskStatus.IN_PROGRESS
                  ? TaskStatus.COMPLETED
                  : TaskStatus.NOT_STARTED,
            };
          }
          return task;
        });
        return {
          ...goal,
          tasks: updatedTasks,
          updated_on: new Date().toISOString(),
        };
      }
      return goal;
    })
  );

  try {
    const resp = await apios.put(`/goals/${goalId}/tasks/${taskId}`);
  } catch (error) {
    console.error('Error updating task completion status:', error);
    setGoals(originalGoals);
    //throw error;
  }
};
