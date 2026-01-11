import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../api/tasks";
import BottomAppBar from "../../components/BottomAppBar";
import { SortableTaskList } from "../../components/SortableTaskList.tsx";
import SortOrderMenu from "../../components/SortOrderMenu.tsx";
import { useListsState } from "../../providers/ListsProvider";

export default function Home() {
  const { listsLoaded, currentList } = useListsState();

  const { data: tasks } = useQuery({
    queryKey: ["tasks", currentList?.id],
    queryFn: () => getTasks({ listId: currentList.id }),
    enabled: listsLoaded,
  });

  const activeTasks = tasks?.filter((task) => !task.complete);

  const completedTasks = tasks?.filter((task) => task.complete);

  const hasCompletedTasks = (completedTasks?.length || 0) > 0;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">{currentList.name}</Typography>
        <SortOrderMenu />
      </Stack>
      {activeTasks ? (
        // By adding lots of space at the bottom, it makes it clear we have scrolled to the end of the list.
        <Stack pb="6rem">
          <SortableTaskList complete={false} />
          {hasCompletedTasks && (
            <Accordion defaultExpanded disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {completedTasks?.length} completed tasks
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SortableTaskList complete={true} />
              </AccordionDetails>
            </Accordion>
          )}
        </Stack>
      ) : (
        <CircularProgress />
      )}
      <BottomAppBar />
    </>
  );
}
