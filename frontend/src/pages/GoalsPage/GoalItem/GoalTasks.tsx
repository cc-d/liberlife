import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { GoalTaskOut, GoalOut } from "../../../api";

interface GoalTasksProps {
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  handleAddTask: any;
  handleDeleteTask: any;
  goal: GoalOut | null;
  onToggle: any;
}

export const GoalTasks: React.FC<GoalTasksProps> = ({
  newTaskText,
  setNewTaskText,
  handleAddTask,
  goal,
  onToggle,
  handleDeleteTask,
}) => {
  const tasks: GoalTaskOut[] = goal ? goal.tasks : [];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Divider
        sx={{
          backgroundColor: "#303030",
          m: 0,
          p: 0,
          ml: 0.5,
          mr: 0.5,
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          ml: 0.5,
          mr: 0.5,
          height: "100%",
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
        <Box
          sx={{
            m: 0,
            p: 0,
            mt: 1,
            mb: 1,
          }}
        >
          {goal &&
            tasks.map((task) => (
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  flexGrow: 1,
                  pt: 0.25,
                  pb: 0.25,
                  width: "100%",
                  "&:active": {
                    backgroundColor: "#303030",
                  },
                  "@media (pointer: fine)": {
                    "&:hover": {
                      backgroundColor: "#303030",
                    },
                  },
                }}
                key={task.id}
                onClick={() => onToggle(goal.id, task.id, task.completed)}
              >
                <Checkbox
                  checked={task.completed}
                  sx={{ m: 0, p: 0.5, mr: 0.5 }}
                />
                <Box
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                    color: "inherit",
                    opacity: task.completed ? 0.75 : 1,
                    flexGrow: 1,
                    overflowWrap: "anywhere",
                  }}
                >
                  <Typography variant="subtitle1">{task.text}</Typography>
                </Box>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent triggering the onToggle when deleting
                    handleDeleteTask(goal.id, task.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default GoalTasks;
