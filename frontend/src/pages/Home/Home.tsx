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
import Task from "../../components/Task";
import { useListsState } from "../../providers/ListsProvider";

export default function Home() {
  const { listsLoaded, currentList } = useListsState();

  const { data: tasks } = useQuery({
    queryKey: ["tasks", currentList?.id],
    queryFn: () => getTasks({ listId: currentList.id }),
    enabled: listsLoaded,
  });

  const activeTasks = tasks
    ?.filter((task) => !task.complete)
    .sort((a, b) => {
      // Sort by creation date for active
      if (a.created < b.created) return 1;
      if (a.created > b.created) return -1;
      // Both identical, return 0
      return 0;
    });

  const completedTasks = tasks
    ?.filter((task) => task.complete)
    .sort((a, b) => {
      // sort by date last updated for complete tasks
      if (a.updated < b.updated) return 1;
      if (a.updated > b.updated) return -1;
      // Both identical, return 0
      return 0;
    });
  const hasCompletedTasks = (completedTasks?.length || 0) > 0;

  return (
    <>
      <Typography variant="h1">{currentList.name}</Typography>
      {activeTasks ? (
        // By adding lots of space at the bottom, it makes it clear we have scrolled to the end of the list.
        <Stack pb="6rem">
          {activeTasks?.map((task) => (
            <Task key={task.id} task={task} />
          ))}
          {hasCompletedTasks && (
            <Accordion defaultExpanded disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {completedTasks?.length} completed tasks
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {completedTasks?.map((task) => (
                  <Task key={task.id} task={task} />
                ))}
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
