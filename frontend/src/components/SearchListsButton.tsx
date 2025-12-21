import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { lists } from "../api/lists.ts";
import useDebounce from "../hooks/useDebounce.ts";
import FormTextField from "./form/FormTextField.tsx";
import SearchListResult from "./SearchListResult.tsx";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchListsButton() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    reset();
    setOpen(false);
  };
  const { control, reset, watch } = useForm({
    defaultValues: { search: "" },
  });

  const searchText = useDebounce(watch("search"), 300);
  const { data } = useQuery({
    queryKey: ["Lists", searchText],
    queryFn: () => lists({ search: searchText }),
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        disableRestoreFocus
        slots={{
          transition: Transition,
        }}
      >
        <Form control={control}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Search
              </Typography>
            </Toolbar>
          </AppBar>
          <Stack pt="2rem" px="1rem">
            <FormTextField
              autoFocus
              required
              fullWidth
              BaseTextFieldProps={{
                form: { autocomplete: "off" },
              }}
              control={control}
              label="Seach"
              variant="outlined"
              id="search"
              name="search"
            />
          </Stack>
        </Form>
        {data?.map((list) => (
          <SearchListResult
            key={list.id}
            list={list}
            closeFunction={handleClose}
          />
        ))}
      </Dialog>
      <IconButton color="inherit">
        <SearchIcon onClick={handleClickOpen} />
      </IconButton>
    </>
  );
}
