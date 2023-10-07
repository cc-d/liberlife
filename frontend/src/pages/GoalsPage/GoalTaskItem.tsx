import { ListItem } from '@mui/material';
import { GoalTaskOut } from '../../api';
export const GoalTaskItem: React.FC<{ task: GoalTaskOut, goalId: number, onToggle: Function }> = ({ task, goalId, onToggle }) => {
    return (
      <ListItem
        key={task.id}
        onClick={() => onToggle(goalId, task.id, task.completed)}
        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
      >
        {task.text}
      </ListItem>
    );
  }