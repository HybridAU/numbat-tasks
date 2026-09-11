import { fetchWithAuth } from "./fetch.ts";
import type { TaskDetails } from "./tasks.ts";

export type SubTaskDetails = {
  // Only included when creating a subtask for a task that doesn't exist yet
  parentTask?: TaskDetails;
  id: number;
  created: string;
  updated: string;
  text: string;
  complete: boolean;
};

type SubTasksResponse = SubTaskDetails[];

type subTasksRequest = {
  listId: number;
  taskId: number;
};

export type addSubTaskRequest = {
  listId: number;
  taskId?: number;
  text: string;
  complete?: boolean;
};

export type updateSubTaskRequest = {
  listId: number;
  taskId: number;
  subTaskId: number;
  text?: string;
  complete?: boolean;
};

export type deleteSubTaskRequest = {
  listId: number;
  taskId: number;
  subTaskId: number;
};

const getSubTasks = async ({
  listId,
  taskId,
}: subTasksRequest): Promise<SubTasksResponse> => {
  const response = await fetchWithAuth(
    `/api/tasks/list/${listId}/task/${taskId}/subtask/`,
  );
  return (await response.json()) as SubTasksResponse;
};

const addSubTask = async ({
  text,
  listId,
  taskId,
}: addSubTaskRequest): Promise<SubTaskDetails> => {
  if (taskId === undefined) {
    // Before we can add a subtask, we need to create the parent task
    const response = await fetchWithAuth(`/api/tasks/list/${listId}/task/`, {
      method: "POST",
      body: JSON.stringify({ text: " " }),
    });
    if (response.ok) {
      const parentTask = (await response.json()) as TaskDetails;
      taskId = parentTask.id;
      const subTaskResponse = await fetchWithAuth(
        `/api/tasks/list/${listId}/task/${taskId}/subtask/`,
        {
          method: "POST",
          body: JSON.stringify({ text: text }),
        },
      );
      if (subTaskResponse.ok) {
        return {
          ...(await subTaskResponse.json()),
          parentTask: parentTask,
        } as SubTaskDetails;
      }
      throw new Error(`${response.statusText}`);
    }
    throw new Error(`${response.statusText}`);
  } else {
    const response = await fetchWithAuth(
      `/api/tasks/list/${listId}/task/${taskId}/subtask/`,
      {
        method: "POST",
        body: JSON.stringify({ text: text }),
      },
    );
    if (response.ok) {
      return (await response.json()) as SubTaskDetails;
    }
    throw new Error(`${response.statusText}`);
  }
};

const updateSubTask = async ({
  text,
  complete,
  listId,
  taskId,
  subTaskId,
}: updateSubTaskRequest): Promise<SubTaskDetails> => {
  const response = await fetchWithAuth(
    `/api/tasks/list/${listId}/task/${taskId}/subtask/${subTaskId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({ text: text, complete: complete }),
    },
  );
  if (response.ok) {
    return (await response.json()) as SubTaskDetails;
  }
  throw new Error(`${response.statusText}`);
};

const deleteSubTask = async ({
  listId,
  taskId,
  subTaskId,
}: deleteSubTaskRequest): Promise<void> => {
  const response = await fetchWithAuth(
    `/api/tasks/list/${listId}/task/${taskId}/subtask/${subTaskId}/`,
    {
      method: "DELETE",
    },
  );
  if (response.ok) {
    return;
  }
  throw new Error(`${response.statusText}`);
};

export { addSubTask, deleteSubTask, getSubTasks, updateSubTask };
