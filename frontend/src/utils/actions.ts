import React from 'react';
import apios from './apios';
import { GoalOut, GoalTaskOut, TaskStatus } from '../api';

export const actionUpdateGoal = async (
  setGoals: React.Dispatch<React.SetStateAction<GoalOut[]>>,
  goalId: number,
  updatedText?: string,
  updatedNotes?: string | null,
  archived?: boolean,
  tasksLocked?: boolean
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
    } else if (tasksLocked !== undefined) {
      payload.tasks_locked = tasksLocked;
    }

    const response = await apios.put(endpoint, payload);

    if (response.status === 200) {
      setGoals((prevGoals) =>
        prevGoals.map((g) => {
          if (g.id !== goalId) return g;
          if (updatedText !== undefined) return { ...g, text: updatedText };
          if (archived !== undefined) return { ...g, archived: archived };
          if (updatedNotes !== undefined) return { ...g, notes: updatedNotes };
          if (tasksLocked !== undefined)
            return { ...g, tasks_locked: tasksLocked };
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
  try {
    const response = await apios.delete(`/goals/${goalId}`);
    if (response.status === 200 || response.status === 204) {
      setGoals(goals.filter((goal) => goal.id !== goalId));
    }
  } catch (error) {
    console.error('Error deleting goal:', error);
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
