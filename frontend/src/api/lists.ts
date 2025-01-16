export type ListDetails = {
  id: number;
  created: string;
  updated: string;
  name: string;
  active: boolean;
};

export type addListRequest = {
  authHeader?: string;
  name: string;
  active?: boolean;
};

export type updateListRequest = {
  authHeader?: string;
  name: string;
  active: boolean;
  listId: number;
};

export type deleteListRequest = {
  authHeader?: string;
  listId: number;
};

type ListsResponse = ListDetails[];

const lists = async (authHeader?: string): Promise<ListsResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
    },
  );
  return (await response.json()) as ListsResponse;
};

const addList = async ({
  authHeader,
  name,
  active,
}: addListRequest): Promise<ListDetails> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify({ name: name, active: active }),
    },
  );
  if (response.ok) {
    return (await response.json()) as ListDetails;
  }
  throw new Error(`${response.statusText}`);
};

const updateList = async ({
  authHeader,
  name,
  active,
  listId,
}: updateListRequest): Promise<ListDetails> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/${listId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify({ name: name, active: active }),
    },
  );
  if (response.ok) {
    return (await response.json()) as ListDetails;
  }
  throw new Error(`${response.statusText}`);
};

const deleteList = async ({
  authHeader,
  listId,
}: deleteListRequest): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/${listId}/`,
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

export { lists, addList, updateList, deleteList };
