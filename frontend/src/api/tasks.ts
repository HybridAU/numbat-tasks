import { fetchWithAuth } from "./fetch.ts";

export type TaskDetails = {
  id: number;
  created: string;
  updated: string;
  text: string;
  complete: boolean;
};

type TasksResponse = TaskDetails[];

type tasksRequest = {
  listId: number;
};

export type addTaskRequest = {
  listId: number;
  text: string;
  complete?: boolean;
};

export type updateTaskRequest = {
  listId: number;
  taskId: number;
  text?: string;
  complete?: boolean;
};

export type deleteTaskRequest = {
  listId: number;
  taskId: number;
};

const getTasks = async ({ listId }: tasksRequest): Promise<TasksResponse> => {
  const response = await fetchWithAuth(`/api/tasks/list/${listId}/task/`);
  return (await response.json()) as TasksResponse;
};

const addTask = async ({
  text,
  listId,
}: addTaskRequest): Promise<TaskDetails> => {
  const response = await fetchWithAuth(`/api/tasks/list/${listId}/task/`, {
    method: "POST",
    body: JSON.stringify({ text: text }),
  });
  if (response.ok) {
    return (await response.json()) as TaskDetails;
  }
  throw new Error(`${response.statusText}`);
};

const updateTask = async ({
  text,
  complete,
  listId,
  taskId,
}: updateTaskRequest): Promise<TaskDetails> => {
  const response = await fetchWithAuth(
    `/api/tasks/list/${listId}/task/${taskId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({ text: text, complete: complete }),
    },
  );
  if (response.ok) {
    return (await response.json()) as TaskDetails;
  }
  throw new Error(`${response.statusText}`);
};

const deleteTask = async ({
  listId,
  taskId,
}: deleteTaskRequest): Promise<void> => {
  const response = await fetchWithAuth(
    `/api/tasks/list/${listId}/task/${taskId}/`,
    {
      method: "DELETE",
    },
  );
  if (response.ok) {
    return;
  }
  throw new Error(`${response.statusText}`);
};

export { getTasks, addTask, updateTask, deleteTask };
