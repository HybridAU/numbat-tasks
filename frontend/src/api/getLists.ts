type ListDetails = {
  id: number;
  created: string;
  updated: string;
  name: string;
  active: boolean;
};

type ListsResponse = ListDetails[];

const getLists = async (authHeader: string | null): Promise<ListsResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/tasks/list`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader || "",
      },
    },
  );
  return (await response.json()) as ListsResponse;
};

export default getLists;
