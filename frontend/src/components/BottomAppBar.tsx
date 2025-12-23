import { AppBar, Box, Toolbar } from "@mui/material";
import AddEditTask from "./AddEditTask";
import ListActionsMenu from "./ListActionsMenu";
import NavDraw from "./NavDraw";
import SearchListsButton from "./SearchListsButton.tsx";

export default function BottomAppBar() {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <NavDraw />
        <AddEditTask />
        <Box sx={{ flexGrow: 1 }} />
        <SearchListsButton />
        <ListActionsMenu />
      </Toolbar>
    </AppBar>
  );
}
