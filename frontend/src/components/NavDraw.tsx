import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
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
        {activeLists.map((list) => (
          <TaskListButton key={list.id} list={list} />
        ))}
        <AddEditList editCurrentList={false} />
        {hasArchivedLists && (
          <Stack pt={3}>
            <Divider />
            <Typography color="text.secondary" textAlign="center" pt={1}>
              Archived lists
            </Typography>
            {archivedLists.map((list) => (
              <TaskListButton key={list.id} list={list} />
            ))}
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
