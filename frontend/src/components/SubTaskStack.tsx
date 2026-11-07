import { Stack } from "@mui/material";
import type { TaskDetails } from "../api/tasks.ts";
import EditSubTask from "./EditSubTask.tsx";

type SubTaskStackProps = {
  listId: number;
  task: TaskDetails;
};

export default function SubTaskStack({ listId, task }: SubTaskStackProps) {
  return (
    <Stack>
      {task.subtasks?.map((subtask) => (
        <EditSubTask
          key={subtask.id}
          subtask={subtask}
          taskId={task.id}
          listId={listId}
        />
      ))}
      {/*<AddSubTask listId={listId} taskId={task.id} />*/}
    </Stack>
  );
}
