import { Checkbox, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubTask, type addSubTaskRequest } from "../api/subtasks.ts";

type AddSubTaskProps = {
  listId: number;
  taskId: number;
};

export default function AddSubTask({ taskId, listId }: AddSubTaskProps) {
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
    <Stack direction="row" sx={{ alignItems: "flex-start", flex: 1 }}>
      <Checkbox
        checked={false}
        onClick={() =>
          mutate({
            listId: listId,
            taskId: taskId,
            text: "",
            complete: true,
          })
        }
      />
      <Stack sx={{ marginTop: "9px" }}>
        <TextField
          fullWidth
          variant="standard"
          slotProps={{ htmlInput: { autoCapitalize: "sentences" } }}
          onBlur={(e) => {
            if (e.value !== "") {
              mutate({
                listId: listId,
                taskId: taskId,
                text: e.target.value,
              });
              e.value = "";
            }
          }}
        />
      </Stack>
    </Stack>
  );
}
