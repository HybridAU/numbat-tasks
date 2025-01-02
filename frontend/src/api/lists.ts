export type ListDetails = {
  id: number;
  created: string;
  updated: string;
  name: string;
  active: boolean;
};

export type addListRequest = {
  authHeader: string | null;
  name: string;
};

type ListsResponse = ListDetails[];

const lists = async (authHeader: string | null): Promise<ListsResponse> => {
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
}: addListRequest): Promise<ListDetails> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
      body: JSON.stringify({ name: name }),
    },
  );
  if (response.ok) {
    return (await response.json()) as ListDetails;
  }
  throw new Error(`${response.statusText}`);
};

export { lists, addList };
