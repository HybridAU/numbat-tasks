import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateList, type updateListRequest } from "../api/lists.ts";
import { getTasks } from "../api/tasks.ts";
import { useListsState } from "../providers/ListsProvider.tsx";
import Task from "./Task.tsx";

export function SortableTaskList({ complete }: { complete: boolean }) {
  const { listsLoaded, currentList } = useListsState();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: updateListRequest) => updateList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
    },
  });
  const { data: tasks } = useQuery({
    queryKey: ["tasks", currentList?.id],
    queryFn: () => getTasks({ listId: currentList.id }),
    enabled: listsLoaded,
  });

  const displayTasks = tasks?.filter((task) => task.complete === complete);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const taskIds = tasks?.map((task) => task.id) || [];
    const oldIndex = taskIds.indexOf(Number(active.id));
    const newIndex = taskIds.indexOf(Number(over?.id));
    const newOrder = arrayMove(taskIds, oldIndex, newIndex);

    // TODO should this be part of the mutation?
    // Optimistically update to the new value, after we do the mutation, the query will be invalidated,
    // but we continue to display stale data while it's refetching, this is to stop it the task bouncing
    // back to its original position for a second.
    queryClient.setQueryData(
      ["tasks", currentList.id],
      arrayMove(tasks || [], oldIndex, newIndex),
    );

    mutate({ manual_order: newOrder, listId: currentList.id });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={displayTasks || []}
        strategy={verticalListSortingStrategy}
      >
        {displayTasks?.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
