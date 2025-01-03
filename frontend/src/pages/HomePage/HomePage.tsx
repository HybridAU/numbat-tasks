import { CircularProgress, Container, Typography } from "@mui/material";
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

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h1">{currentList.name}</Typography>
      {tasks ? (
        <div>
          {tasks?.map((task) => (
            <Task key={task.id} {...task} />
          ))}
        </div>
      ) : (
        <CircularProgress />
      )}
      <BottomAppBar />
    </Container>
  );
}
