import ListIcon from "@mui/icons-material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { ListDetails } from "../api/lists.ts";
import { useListsDispatch } from "../providers/ListsProvider.tsx";

type SearchListResultProps = {
  list: ListDetails;
  closeFunction?: () => void;
};

export default function TaskListButton({
  list,
  closeFunction,
}: SearchListResultProps) {
  const listsDispatch = useListsDispatch();
  const handelClick = () => {
    listsDispatch({ type: "SET_CURRENT_LIST", payload: list });
    if (closeFunction) closeFunction();
  };

  return (
    <ListItem>
      <ListItemIcon sx={{ marginRight: "-30px" }}>
        <ListIcon />
      </ListItemIcon>
      <ListItemButton onClick={handelClick}>
        <ListItemText primary={list.name} />
      </ListItemButton>
    </ListItem>
  );
}
