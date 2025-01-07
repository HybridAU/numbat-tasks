export type TaskDetails = {
  id: number;
  created: string;
  updated: string;
  text: string // upset biome
  complete: boolean;
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

export type updateTaskRequest = {
  authHeader: string | null;
  listId: number;
  taskId: number;
  text?: string;
  complete?: boolean;
};

export type deleteTaskRequest = {
  authHeader: string | null;
  listId: number;
  taskId: number;
};

const getTasks = async ({
  authHeader,
  listId,
}: tasksRequest): Promise<TasksResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/${listId}/task/`,
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
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/${listId}/task/`,
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

const updateTask = async ({
  authHeader,
  text,
  complete,
  listId,
  taskId,
}: updateTaskRequest): Promise<TaskDetails> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/${listId}/task/${taskId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify({ text: text, complete: complete }),
    },
  );
  if (response.ok) {
    return (await response.json()) as TaskDetails;
  }
  throw new Error(`${response.statusText}`);
};

const deleteTask = async ({
  authHeader,
  listId,
  taskId,
}: deleteTaskRequest): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/${listId}/task/${taskId}/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
    },
  );
  if (response.ok) {
    return;
  }
  throw new Error(`${response.statusText}`);
};

export { getTasks, addTask, updateTask, deleteTask };
