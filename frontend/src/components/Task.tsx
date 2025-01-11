import { Checkbox, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { type TaskDetails, updateTask } from "../api/tasks";
import { useListsState } from "../providers/ListsProvider";
import AddEditTask from "./AddEditTask";

export default function Task({ task }: { task: TaskDetails }) {
  const queryClient = useQueryClient();
  const authHeader = useAuthHeader();
  const { currentList } = useListsState();
  const { mutate } = useMutation({
    mutationFn: () => {
      return updateTask({
        authHeader: authHeader,
        listId: currentList?.id,
        taskId: task.id,
        complete: !task.complete,
        text: task.text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
    },
  });
  return (
    <Stack direction="row" alignItems="center">
      <Checkbox checked={task.complete} onClick={() => mutate()} />
      <AddEditTask task={task} />
    </Stack>
  );
}
