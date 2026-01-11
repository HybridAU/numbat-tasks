import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { uncheckAllTasks, type uncheckListRequest } from "../api/lists.ts";
import { useListsState } from "../providers/ListsProvider.tsx";
import AddEditList from "./AddEditList";

export default function ListActionsMenu() {
  const queryClient = useQueryClient();
  const { currentList } = useListsState();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { mutate: doUncheckAllTasks } = useMutation({
    mutationFn: (data: uncheckListRequest) => uncheckAllTasks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
      handleClose();
    },
  });

  return (
    <div>
      <IconButton
        color="inherit"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            doUncheckAllTasks({ listId: currentList.id });
          }}
        >
          Uncheck all items
        </MenuItem>
        <AddEditList editCurrentList={true} clearActionMenu={handleClose} />
      </Menu>
    </div>
  );
}
