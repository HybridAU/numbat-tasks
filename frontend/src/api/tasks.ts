type TaskDetails = {
  id: number;
  created: string;
  updated: string;
  text: string;
  completed: boolean;
};

type TasksResponse = TaskDetails[];

type tasksRequest = {
  authHeader: string | null;
  listId: number;
};

export type addTaskRequest = {
  authHeader: string | null;
  listId: number;
  text: string;
  complete?: boolean;
};

const getTasks = async ({
  authHeader,
  listId,
}: tasksRequest): Promise<TasksResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/${listId}/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
    },
  );
  return (await response.json()) as TasksResponse;
};

const addTask = async ({
  authHeader,
  text,
  listId,
}: addTaskRequest): Promise<TaskDetails> => {
  const response = await fetch(
    // TODO!!
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/1/task/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify({ text: text }),
    },
  );
  if (response.ok) {
    return (await response.json()) as TaskDetails;
  }
  throw new Error(`${response.statusText}`);
};

export { getTasks, addTask };
