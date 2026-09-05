import { Stack } from "@mui/material";
import type { TaskDetails } from "../api/tasks.ts";
import AddEditSubTask from "./AddEditSubTask.tsx";

type SubTaskStackProps = {
  listId: number;
  task: TaskDetails;
};

export default function SubTaskStack({ listId, task }: SubTaskStackProps) {
  return (
    <Stack>
      {task.subtasks?.map((subtask) => (
        <AddEditSubTask
          key={subtask.id}
          subtask={subtask}
          taskId={task.id}
          listId={listId}
        />
      ))}
    </Stack>
  );
}
