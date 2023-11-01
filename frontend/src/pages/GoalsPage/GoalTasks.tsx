import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Checkbox,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { GoalTaskOut, GoalOut } from "../../api";

interface GoalTasksProps {
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  handleAddTask: () => void;
  onTaskDelete: (goalId: number, taskId: number) => void;
  goal: GoalOut | null;
  onToggle: (goalId: number, taskId: number, isCompleted: boolean) => void;
  maxElementWidth: string;
}

export const GoalTasks: React.FC<GoalTasksProps> = ({
  newTaskText,
  setNewTaskText,
  handleAddTask,
  goal,
  onToggle,
  onTaskDelete,
  maxElementWidth,
}) => {
  const tasks: GoalTaskOut[] = goal ? goal.tasks : [];
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
        {goal &&
          tasks.map((task) => (
            <Box
              display="flex"
              alignItems="center"
              sx={{
                cursor: "pointer",
                mb: 1,
                flexGrow: 1,
                width: "100%",

                "&:hover": {
                  backgroundColor: "#303030",
                },
              }}
              key={task.id}
              onClick={() => onToggle(goal.id, task.id, task.completed)}
            >
              <Checkbox checked={task.completed} />
              <Box
                component="span"
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                  flexGrow: 1,

                  overflowWrap: "anywhere",
                }}
              >
                <Typography sx={{}}>{task.text}</Typography>
              </Box>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation(); // Prevent triggering the onToggle when deleting
                  onTaskDelete(goal.id, task.id);
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

export default GoalTasks;
