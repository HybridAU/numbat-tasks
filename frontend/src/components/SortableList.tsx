import {
  closestCenter,
  DndContext,
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTasks } from "../api/tasks.ts";
import { useListsState } from "../providers/ListsProvider.tsx";
import Task from "./Task.tsx";

export function SortableList() {
  const { listsLoaded, currentList } = useListsState();
  const { data: tasks } = useQuery({
    queryKey: ["tasks", currentList?.id],
    queryFn: () => getTasks({ listId: currentList.id }),
    enabled: listsLoaded,
  });

  const activeTasks = tasks?.filter((task) => !task.complete);

  // TODO, store this in api
  const [order, setOrder] = useState([1, 2, 3, 4, 5, 6]);
  const orderMap = new Map(order.map((id, idx) => [id, idx]));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log(event);

    if (active.id !== over.id) {
      setOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  if (currentList.sort_order === "manual") {
    activeTasks?.sort((a, b) => {
      const indexA = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity;
      const indexB = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity;
      return indexA - indexB;
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={activeTasks || []}
        strategy={verticalListSortingStrategy}
      >
        {activeTasks?.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
