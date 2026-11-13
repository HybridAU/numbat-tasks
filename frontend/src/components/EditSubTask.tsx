import ClearIcon from "@mui/icons-material/Clear";
import { Checkbox, IconButton, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type KeyboardEvent, useState } from "react";
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
  showDelete: boolean;
};

export default function EditSubTask({
  subtask,
  taskId,
  listId,
  showDelete,
}: EditSubTaskProps) {
  const queryClient = useQueryClient();
  const [subTaskText, setSubTaskText] = useState(subtask.text);
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

  const updateText = () => {
    mutate({
      listId: listId,
      taskId: taskId,
      subTaskId: subtask.id,
      text: subTaskText,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      updateText();
      // TODO
      //  This dismisses the keyboard, which is ok, but a better UX would
      //  be moving to the next subtask, and if this the last subtask, creating
      //  a new subtask and moving to that.
      (event.target as HTMLElement).blur();
    }
  };

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
      <Stack sx={{ marginTop: "9px", flexGrow: 1 }}>
        <TextField
          fullWidth
          variant="standard"
          slotProps={{
            htmlInput: {
              autoCapitalize: "sentences",
              style: {
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            },
          }}
          onChange={(e) => setSubTaskText(e.target.value)}
          onBlur={updateText}
          onKeyDown={handleKeyDown}
          defaultValue={subtask.text}
        />
      </Stack>
      {showDelete && (
        <IconButton onClick={() => doDeleteTask()}>
          <ClearIcon />
        </IconButton>
      )}
    </Stack>
  );
}
