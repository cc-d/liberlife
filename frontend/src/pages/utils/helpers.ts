import { TaskStatus } from "../../api/";
export const decodePayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    const jsonObject = JSON.parse(decodedPayload);
    return jsonObject.sub; // Assuming the JWT payload has a "username" field
  } catch (error) {
    console.error("Error decoding the token", error);
    return null;
  }
};

export const getTaskStatus = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.NOT_STARTED:
      return TaskStatus.IN_PROGRESS;
    case TaskStatus.IN_PROGRESS:
      return TaskStatus.COMPLETED;
    case TaskStatus.COMPLETED:
      return TaskStatus.NOT_STARTED;
    default:
      return TaskStatus.NOT_STARTED;
  }
};
