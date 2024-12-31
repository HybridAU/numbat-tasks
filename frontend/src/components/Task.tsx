import { Checkbox, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { type TaskDetails, updateTask } from "../api/tasks.ts";

export default function Task({ text, complete, id }: TaskDetails) {
  const queryClient = useQueryClient();
  const authHeader = useAuthHeader();
  // TODO list id is hard coded to 1, build a list provider to give state / context...
  const listId = 1;
  const { mutate } = useMutation({
    mutationFn: () => {
      return updateTask({
        authHeader: authHeader,
        listId: listId,
        taskId: id,
        complete: !complete,
        text: text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
  return (
    <Stack direction="row" alignItems="center">
      <Checkbox checked={complete} onClick={() => mutate()} />
      <Typography>{text}</Typography>
    </Stack>
  );
}
