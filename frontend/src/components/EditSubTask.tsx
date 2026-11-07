import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, IconButton, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import {
  deleteSubTask,
  type SubTaskDetails,
  updateSubTask,
  type updateSubTaskRequest,
} from "../api/subtasks.ts";

type EditSubTaskProps = {
  listId: number;
  taskId: number;
  subtask: SubTaskDetails;
};

export default function EditSubTask({
  subtask,
  taskId,
  listId,
}: EditSubTaskProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (update: updateSubTaskRequest) => {
      return updateSubTask({
        listId: update.listId,
        taskId: update.taskId,
        subTaskId: update.subTaskId,
        complete: update.complete,
        text: update.text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
  const { mutate: doDeleteTask } = useMutation({
    mutationFn: () => {
      return deleteSubTask({
        listId: listId,
        taskId: taskId,
        subTaskId: subtask.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
  return (
    <Stack direction="row" sx={{ alignItems: "flex-start", flex: 1 }}>
      <Checkbox
        checked={subtask.complete}
        onClick={() =>
          mutate({
            listId: listId,
            taskId: taskId,
            subTaskId: subtask.id,
            complete: !subtask.complete,
          })
        }
      />
      <Stack sx={{ marginTop: "9px" }}>
        <TextField
          fullWidth
          variant="standard"
          slotProps={{ htmlInput: { autoCapitalize: "sentences" } }}
          onBlur={(e) =>
            mutate({
              listId: listId,
              taskId: taskId,
              subTaskId: subtask.id,
              text: e.target.value,
            })
          }
          defaultValue={subtask.text}
        />
      </Stack>
      <IconButton color="error" onClick={() => doDeleteTask()}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
