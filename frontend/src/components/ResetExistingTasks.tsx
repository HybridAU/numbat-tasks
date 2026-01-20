import { Checkbox, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, type TaskDetails, updateTask } from "../api/tasks.ts";
import { useListsState } from "../providers/ListsProvider.tsx";

type ResetExistingTasksProps = {
  searchText: string;
  closeFunction: () => void;
};

// Find existing task and offer to uncheck them rather than creating new tasks
export default function ResetExistingTasks({
  searchText,
  closeFunction,
}: ResetExistingTasksProps) {
  const { listsLoaded, currentList } = useListsState();
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery({
    queryKey: ["tasks", currentList?.id],
    queryFn: () => getTasks({ listId: currentList.id }),
    enabled: listsLoaded,
  });

  const { mutate: uncheckTask } = useMutation({
    mutationFn: (task: TaskDetails) => {
      return updateTask({
        listId: currentList?.id,
        taskId: task.id,
        complete: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
      closeFunction();
    },
  });

  const matchingTasks = tasks?.filter(
    (task) => task.complete === true && task.text.includes(searchText),
  );
  if (matchingTasks?.length && matchingTasks.length < 4) {
    return (
      <Stack direction="column">
        {matchingTasks.map((task) => (
          <Stack
            direction="row"
            key={task.id}
            onClick={() => uncheckTask(task)}
            gap={2}
          >
            <Checkbox checked />
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
              }}
            >
              {task.text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    );
  }
}
