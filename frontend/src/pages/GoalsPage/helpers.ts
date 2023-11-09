import { GoalOut } from "../../api";

export const goalDateHelper = (goal: GoalOut): number => {
  if (goal && goal.updated_on) {
    return new Date(goal.updated_on).getTime();
  } else {
    if (goal && goal.created_on) {
      return new Date(goal.created_on).getTime();
    }
    return 0;
  }
};
