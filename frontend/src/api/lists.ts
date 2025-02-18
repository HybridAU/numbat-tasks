import { fetchWithAuth } from "./fetch.ts";

export type ListDetails = {
  id: number;
  created: string;
  updated: string;
  name: string;
  active: boolean;
};

export type addListRequest = {
  name: string;
  active?: boolean;
};

export type updateListRequest = {
  name: string;
  active: boolean;
  listId: number;
};

export type deleteListRequest = {
  listId: number;
};

type ListsResponse = ListDetails[];

const lists = async (): Promise<ListsResponse> => {
  const response = await fetchWithAuth("/api/tasks/list");
  return (await response.json()) as ListsResponse;
};

const addList = async ({
  name,
  active,
}: addListRequest): Promise<ListDetails> => {
  console.log("adding");
  const response = await fetchWithAuth("/api/tasks/list/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, active: active }),
  });
  if (response.ok) {
    return (await response.json()) as ListDetails;
  }
  throw new Error(`${response.statusText}`);
};

const updateList = async ({
  name,
  active,
  listId,
}: updateListRequest): Promise<ListDetails> => {
  const response = await fetchWithAuth(`/api/tasks/list/${listId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, active: active }),
  });
  if (response.ok) {
    return (await response.json()) as ListDetails;
  }
  throw new Error(`${response.statusText}`);
};

const deleteList = async ({ listId }: deleteListRequest): Promise<void> => {
  const response = await fetchWithAuth(`/api/tasks/list/${listId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return;
  }
  throw new Error(`${response.statusText}`);
};

export { lists, addList, updateList, deleteList };
