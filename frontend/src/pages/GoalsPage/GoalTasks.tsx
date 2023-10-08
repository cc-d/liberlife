import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Checkbox,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete"; // <-- Import the DeleteIcon
import { GoalTaskOut } from "../../api";

interface GoalTasksProps {
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  handleAddTask: () => void;
  onTaskDelete: (goalId: number, taskId: number) => void; // <-- Modify the type for clarity
  tasks: GoalTaskOut[];
  goalId: number;
  onToggle: (goalId: number, taskId: number, isCompleted: boolean) => void;
  maxElementWidth: string;
}

export const GoalTasks: React.FC<GoalTasksProps> = ({
  newTaskText,
  setNewTaskText,
  handleAddTask,
  tasks,
  goalId,
  onToggle,
  onTaskDelete,
  maxElementWidth,
}) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: 1,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add task..."
          sx={{ flexGrow: 1, marginRight: 1 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
        />
        <IconButton onClick={handleAddTask}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box mt={2}>
        {tasks.map((task) => (
          <Box
            display="flex"
            alignItems="center"
            sx={{
              cursor: "pointer",
              mb: 1,
              "&:hover": {
                backgroundColor: "#303030",
              },
            }}
            key={task.id}
            onClick={() => onToggle(goalId, task.id, task.completed)}
          >
            <Checkbox checked={task.completed} />
            <Box
              component="span"
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                flexGrow: 1,
                maxWidth: maxElementWidth,
                overflowWrap: "anywhere",
              }}
            >
              <Typography>{task.text}</Typography>
            </Box>
            <IconButton
              onClick={(event) => {
                event.stopPropagation(); // Prevent triggering the onToggle when deleting
                onTaskDelete(goalId, task.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
