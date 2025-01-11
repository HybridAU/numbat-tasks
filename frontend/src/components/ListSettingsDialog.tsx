import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import type { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as React from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Form, useForm } from "react-hook-form";
import { updateList, type updateListRequest } from "../api/lists.ts";
import { useListsState } from "../providers/ListsProvider.tsx";
import FormCheckBox from "./form/FormCheckBox.tsx";
import FormTextField from "./form/FormTextField.tsx";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ListSettingsDialog() {
  const [open, setOpen] = useState(false);
  const { currentList } = useListsState();
  const authHeader = useAuthHeader();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { name: "", active: true },
  });

  const handleOpen = () => {
    reset({ name: currentList.name, active: currentList.active });
    setOpen(true);
  };
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleSaveClick = ({
    name,
    active,
  }: { name: string; active: boolean }) => {
    doUpdateList({
      name: name,
      active: active,
      listId: currentList.id,
      authHeader: authHeader,
    });
    handleClose();
  };

  const { mutate: doUpdateList } = useMutation({
    mutationFn: (data: updateListRequest) => updateList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Lists"] });
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        disableRestoreFocus
        TransitionComponent={Transition}
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
                List Settings
              </Typography>
              <IconButton
                color="error"
                onClick={() => {
                  /* TODO */
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="inherit"
                type="submit"
                onClick={handleSubmit((data) => {
                  handleSaveClick(data);
                })}
              >
                <SaveIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Stack pt="2rem" px="1rem">
            <FormTextField
              autoFocus
              required
              fullWidth
              control={control}
              label="List Name"
              variant="outlined"
              id="name"
              name="name"
            />
            <FormCheckBox
              control={control}
              label="Active"
              id="active"
              name="active"
            />
          </Stack>
        </Form>
      </Dialog>
      <MenuItem onClick={handleOpen}>List Settings</MenuItem>
    </>
  );
}
