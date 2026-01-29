import { fetchWithAuth } from "./fetch.ts";

export type SortOrder =
  | "text"
  | "-text"
  | "created"
  | "-created"
  | "updated"
  | "-updated"
  | "manual";

export type ListDetails = {
  id: number;
  created: string;
  updated: string;
  name: string;
  pinned: boolean;
  sort_order: SortOrder;
  manual_order: number[];
  archived: boolean;
};

export type searchListRequest = {
  search?: string;
};

export type addListRequest = {
  name: string;
  pinned?: boolean;
  archived?: boolean;
  sort_order?: SortOrder;
  manual_order?: number[];
};

export type updateListRequest = {
  name?: string;
  pinned?: boolean;
  archived?: boolean;
  sort_order?: SortOrder;
  manual_order?: number[];
  listId: number;
};

export type deleteListRequest = {
  listId: number;
};

export type uncheckListRequest = {
  listId: number;
};

type ListsResponse = ListDetails[];

const lists = async ({ search }: searchListRequest): Promise<ListsResponse> => {
  let url = "/api/tasks/list/";
  if (search) {
    const params = new URLSearchParams({ search: search });
    url = `/api/tasks/list/?${params.toString()}`;
  }
  const response = await fetchWithAuth(url);
  return (await response.json()) as ListsResponse;
};

const addList = async ({
  name,
  pinned,
  archived,
  sort_order,
  manual_order,
}: addListRequest): Promise<ListDetails> => {
  const response = await fetchWithAuth("/api/tasks/list/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      pinned: pinned,
      archived: archived,
      sort_order: sort_order,
      manual_order: manual_order,
    }),
  });
  if (response.ok) {
    return (await response.json()) as ListDetails;
  }
  throw new Error(`${response.statusText}`);
};

const updateList = async ({
  name,
  pinned,
  archived,
  sort_order,
  manual_order,
  listId,
}: updateListRequest): Promise<ListDetails> => {
  const response = await fetchWithAuth(`/api/tasks/list/${listId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      pinned: pinned,
      archived: archived,
      sort_order: sort_order,
      manual_order: manual_order,
    }),
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

const uncheckAllTasks = async ({
  listId,
}: uncheckListRequest): Promise<void> => {
  const response = await fetchWithAuth(
    `/api/tasks/list/${listId}/uncheck_all_tasks/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (response.ok) {
    return;
  }
  throw new Error(`${response.statusText}`);
};

export { lists, addList, updateList, deleteList, uncheckAllTasks };
