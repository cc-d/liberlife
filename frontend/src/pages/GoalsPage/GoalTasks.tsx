import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Checkbox,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GoalTaskOut } from "../../api";

interface GoalTasksProps {
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  handleAddTask: () => void;
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
            onClick={() => onToggle(goalId, task.id, task.completed)}
            sx={{ cursor: "pointer", mb: 1 }}
            key={task.id}
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
          </Box>
        ))}
      </Box>
    </Box>
  );
};
