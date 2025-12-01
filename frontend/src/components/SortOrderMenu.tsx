import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useMemo } from "react";
import {
  type SortOrder,
  updateList,
  type updateListRequest,
} from "../api/lists.ts";
import { useListsState } from "../providers/ListsProvider.tsx";

const getButtonText = (sortOrder: SortOrder): string => {
  switch (sortOrder) {
    case "text":
    case "-text":
      return "A-Z";
    case "created":
    case "-created":
      return "Created";
    case "updated":
    case "-updated":
      return "Updated";
    case "manual":
      return "Manual";
  }
};

const getButtonIcon = (sortOrder: SortOrder) => {
  switch (sortOrder) {
    case "text":
    case "created":
    case "updated":
      return <ArrowDownwardIcon />;
    case "-text":
    case "-created":
    case "-updated":
      return <ArrowUpwardIcon />;
    case "manual":
      return <SwapVertIcon />;
  }
};

// TODO handel inverting, add arrow icon

export default function SortOrderMenu() {
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { mutate } = useMutation({
    mutationFn: (data: updateListRequest) => updateList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Lists"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handelSelect = (value: SortOrder) => {
    // TODO this is silly, but testing...
    const send =
      value === "text" && currentList.sort_order === "text" ? "-text" : value;
    mutate({ sort_order: send, listId: currentList.id });
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { currentList } = useListsState();

  const buttonText = useMemo(
    () => getButtonText(currentList.sort_order),
    [currentList.sort_order],
  );
  const buttonIcon = useMemo(
    () => getButtonIcon(currentList.sort_order),
    [currentList.sort_order],
  );

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {buttonText}
        {buttonIcon}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={() => handelSelect("text")}>A-Z</MenuItem>
        <MenuItem onClick={() => handelSelect("created")}>Created</MenuItem>
        <MenuItem onClick={() => handelSelect("updated")}>Updated</MenuItem>
        <MenuItem onClick={() => handelSelect("manual")}>Manual</MenuItem>
      </Menu>
    </div>
  );
}
