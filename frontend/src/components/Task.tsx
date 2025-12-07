import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Checkbox, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type TaskDetails, updateTask } from "../api/tasks";
import { useListsState } from "../providers/ListsProvider";
import AddEditTask from "./AddEditTask";

export default function Task({ task }: { task: TaskDetails }) {
  const queryClient = useQueryClient();
  const { currentList } = useListsState();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const { mutate } = useMutation({
    mutationFn: () => {
      return updateTask({
        listId: currentList?.id,
        taskId: task.id,
        complete: !task.complete,
        text: task.text,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Stack ref={setNodeRef} style={style}>
      <Stack direction="row" alignItems="center">
        {currentList.sort_order === "manual" && (
          <Stack
            {...attributes}
            {...listeners}
            sx={{ cursor: "pointer", touchAction: "none" }}
          >
            <DragIndicatorIcon />
          </Stack>
        )}
        <Stack direction="row" alignItems="center">
          <Checkbox checked={task.complete} onClick={() => mutate()} />
          <AddEditTask task={task} />
        </Stack>
      </Stack>
    </Stack>
  );
}
