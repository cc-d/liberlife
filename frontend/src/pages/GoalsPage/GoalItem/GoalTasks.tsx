import React from "react";
import { Box, TextField, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GoalTaskOut, GoalOut } from "../../../api";
import GoalTaskItem from "./GoalTaskItem";
import theme from "../../../theme";

interface GoalTasksProps {
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  handleAddTask: any;
  handleDeleteTask: any;
  tasks: GoalTaskOut[];
  taskGoal: GoalOut;
  nextTaskStatus: Function;
}

export const GoalTasks: React.FC<GoalTasksProps> = ({
  newTaskText,
  setNewTaskText,
  handleAddTask,
  taskGoal,
  tasks, // Receive tasks as a prop
  nextTaskStatus,
  handleDeleteTask,
}) => {
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
          backgroundColor: theme.palette.background.default,
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
          {tasks &&
            tasks.map((task) => (
              <GoalTaskItem
                key={task.id} // Ensure key prop is set
                taskGoal={taskGoal}
                task={task}
                nextTaskStatus={nextTaskStatus}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default GoalTasks;
