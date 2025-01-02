import { Checkbox, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { type TaskDetails, updateTask } from "../api/tasks.ts";
import { useListsState } from "../providers/ListsProvider.tsx";

export default function Task({ text, complete, id }: TaskDetails) {
  const queryClient = useQueryClient();
  const authHeader = useAuthHeader();
  const { currentListId } = useListsState();
  const { mutate } = useMutation({
    mutationFn: () => {
      return updateTask({
        authHeader: authHeader,
        listId: currentListId,
        taskId: id,
        complete: !complete,
        text: text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentListId] });
    },
  });
  return (
    <Stack direction="row" alignItems="center">
      <Checkbox checked={complete} onClick={() => mutate()} />
      <Typography>{text}</Typography>
    </Stack>
  );
}
