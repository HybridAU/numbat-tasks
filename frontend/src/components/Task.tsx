import { Checkbox, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { type TaskDetails, updateTask } from "../api/tasks.ts";
import { useListsState } from "../providers/ListsProvider.tsx";

export default function Task({ text, complete, id }: TaskDetails) {
  const queryClient = useQueryClient();
  const authHeader = useAuthHeader();
  const { currentList } = useListsState();
  const { mutate } = useMutation({
    mutationFn: () => {
      return updateTask({
        authHeader: authHeader,
        listId: currentList?.id,
        taskId: id,
        complete: !complete,
        text: text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
    },
  });
  return (
    <Stack direction="row" alignItems="center">
      <Checkbox checked={complete} onClick={() => mutate()} />
      <Typography>{text}</Typography>
    </Stack>
  );
}
