import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router";
import { useListsState } from "../providers/ListsProvider";
import AddEditList from "./AddEditList";
import TaskListButton from "./TaskListButton.tsx";

export default function NavDraw() {
  const [open, setOpen] = React.useState(false);
  const { lists } = useListsState();
  const navigate = useNavigate();

  const activeLists = lists.filter((list) => !list.archived);
  const archivedLists = lists.filter((list) => list.archived);
  const hasArchivedLists = archivedLists.length > 0;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <AddEditList editCurrentList={false} />
        {activeLists.map((list) => (
          <TaskListButton key={list.id} list={list} />
        ))}
        {hasArchivedLists && (
          <Stack pt={3}>
            <Divider />
            <Accordion defaultExpanded disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                // Prevent the click on the AccordionSummary from closing the NavDraw
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <Typography color="text.secondary" textAlign="center" pt={1}>
                  Archived lists
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {archivedLists.map((list) => (
                  <TaskListButton key={list.id} list={list} />
                ))}
              </AccordionDetails>
            </Accordion>
          </Stack>
        )}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/settings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}
