import { Stack } from "@mui/material";
import type { TaskDetails } from "../api/tasks.ts";
import EditSubTask from "./EditSubTask.tsx";

type SubTaskStackProps = {
  listId: number;
  task: TaskDetails;
  showDelete: boolean;
};

export default function SubTaskStack({
  listId,
  task,
  showDelete,
}: SubTaskStackProps) {
  return (
    // TODO make the subtask stack foldable like complete tasks are
    <Stack sx={{ marginY: 2 }}>
      {task.subtasks?.map((subtask) => (
        <EditSubTask
          key={subtask.id}
          subtask={subtask}
          taskId={task.id}
          listId={listId}
          showDelete={showDelete}
        />
      ))}
    </Stack>
  );
}
