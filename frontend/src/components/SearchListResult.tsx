import { Typography } from "@mui/material";
import type { ListDetails } from "../api/lists.ts";

type SearchListResultProps = {
  list: ListDetails;
};

// TODO maybe this doesn't need to be a seprate component
export default function SearchListResult({ list }: SearchListResultProps) {
  return <Typography key={list.id}>{list.name}</Typography>;
}
