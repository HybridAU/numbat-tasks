import { CircularProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { getTasks } from "../../api/tasks";
import BottomAppBar from "../../components/BottomAppBar";
import Task from "../../components/Task";
import { useListsState } from "../../providers/ListsProvider";

export default function HomePage() {
  const authHeader = useAuthHeader();
  const { listsLoaded, currentList } = useListsState();

  const { data: tasks } = useQuery({
    queryKey: ["tasks", currentList?.id],
    queryFn: () => getTasks({ authHeader, listId: currentList.id }),
    enabled: !!authHeader && listsLoaded,
  });

  const sortedTasks = tasks?.sort((a, b) => {
    // https://typeofnan.dev/sort-array-objects-multiple-properties-javascript/
    // Only sort on complete if not identical
    if (a.complete && !b.complete) return 1;
    if (!a.complete && b.complete) return -1;
    // if identical (both completed or both not) then sort by date created
    if (a.created < b.created) return 1;
    if (a.created > b.created) return -1;
    // // Both identical, return 0
    return 0;
  });

  return (
    <>
      <Typography variant="h1">{currentList.name}</Typography>
      {sortedTasks ? (
        // By adding lots of space at the bottom, it makes it clear we have scrolled to the end of the list.
        <Stack pb="6rem">
          {sortedTasks?.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </Stack>
      ) : (
        <CircularProgress />
      )}
      <BottomAppBar />
    </>
  );
}
