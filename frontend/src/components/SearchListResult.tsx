import { Typography } from "@mui/material";
import type { ListDetails } from "../api/lists.ts";
import { useListsDispatch } from "../providers/ListsProvider.tsx";

type SearchListResultProps = {
  list: ListDetails;
  closeFunction: () => void;
};

// TODO maybe this doesn't need to be a seprate component
export default function SearchListResult({
  list,
  closeFunction,
}: SearchListResultProps) {
  const listsDispatch = useListsDispatch();
  const handelClick = () => {
    listsDispatch({ type: "SET_CURRENT_LIST", payload: list });
    closeFunction();
  };

  return <Typography onClick={handelClick}>{list.name}</Typography>;
}
