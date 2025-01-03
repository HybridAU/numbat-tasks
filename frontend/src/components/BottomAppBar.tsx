import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import AccountMenu from "./AccountMenu.tsx";
import AddEditTask from "./AddEditTask.tsx";
import NavDraw from "./NavDraw.tsx";

export default function BottomAppBar() {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <NavDraw />
        <AddEditTask />
        <Box sx={{ flexGrow: 1 }} />
        {/* TODO this button does nothing, it's just a place holder */}
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
