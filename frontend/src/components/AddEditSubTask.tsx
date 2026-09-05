import { Checkbox, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubTaskDetails, updateSubTask } from "../api/subtasks.ts";
import LinkifyText from "./LinkifyText.tsx";

type AddEditSubTaskProps = {
  listId: number;
  taskId: number;
  subtask: SubTaskDetails;
};

export default function AddEditSubTask({
  subtask,
  taskId,
  listId,
}: AddEditSubTaskProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => {
      return updateSubTask({
        listId: listId,
        taskId: taskId,
        subTaskId: subtask.id,
        complete: !subtask.complete,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
  return (
    <Stack direction="row" sx={{ alignItems: "flex-start", flex: 1 }}>
      <Checkbox checked={subtask.complete} onClick={() => mutate()} />
      <Stack sx={{ marginTop: "9px" }}>
        <Typography
          align="left"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "4",
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
          color={subtask.complete ? "textSecondary" : "textPrimary"}
        >
          <LinkifyText text={subtask.text} />
        </Typography>
      </Stack>
    </Stack>
  );
}
