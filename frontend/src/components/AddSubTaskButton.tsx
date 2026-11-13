import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubTask, type addSubTaskRequest } from "../api/subtasks.ts";

type AddSubTaskProps = {
  listId: number;
  taskId: number;
};

export default function AddSubTaskButton({ taskId, listId }: AddSubTaskProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (update: addSubTaskRequest) => {
      return addSubTask({
        listId: update.listId,
        taskId: update.taskId,
        complete: update.complete,
        text: update.text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
  return (
    <Button
      sx={{ margin: 1 }}
      onClick={() =>
        mutate({
          listId: listId,
          taskId: taskId,
          text: "",
          complete: false,
        })
      }
    >
      Add subtask
    </Button>
  );
}
