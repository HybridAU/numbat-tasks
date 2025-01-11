import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import AddEditTask from "./AddEditTask";
import ListActionsMenu from "./ListActionsMenu";
import NavDraw from "./NavDraw";

export default function BottomAppBar() {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <NavDraw />
        <AddEditTask />
        <Box sx={{ flexGrow: 1 }} />
        {/* TODO this search button does nothing, it's just a place holder */}
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <ListActionsMenu />
      </Toolbar>
    </AppBar>
  );
}
