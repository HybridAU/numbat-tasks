import AddIcon from "@mui/icons-material/Add";
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
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import type { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import {
  addList,
  type addListRequest,
  deleteList,
  type deleteListRequest,
  updateList,
  type updateListRequest,
} from "../api/lists";
import { useListsDispatch, useListsState } from "../providers/ListsProvider";
import FormCheckbox from "./form/FormCheckbox";
import FormTextField from "./form/FormTextField";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ListSettingsDialogProps = {
  editCurrentList: boolean;
  // A function that can be called to clear the actions menu when closing the dialog
  clearActionMenu?: () => void;
};

export default function AddEditList({
  editCurrentList,
  clearActionMenu,
}: ListSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const { currentList, lists } = useListsState();
  const listsDispatch = useListsDispatch();
  const queryClient = useQueryClient();
  const deleteEnabled = lists.length > 1 && editCurrentList;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { name: "", pinned: false, archived: false },
  });

  const handleOpen = () => {
    editCurrentList &&
      reset({ name: currentList.name, archived: currentList.archived });
    setOpen(true);
  };
  const handleClose = () => {
    reset();
    setOpen(false);
    if (clearActionMenu !== undefined) clearActionMenu();
  };

  const handleSaveClick = ({
    name,
    archived,
    pinned,
  }: {
    name: string;
    archived: boolean;
    pinned: boolean;
  }) => {
    if (editCurrentList) {
      doUpdateList({
        name: name,
        pinned: pinned,
        archived: archived,
        listId: currentList.id,
      });
    } else {
      doAddList({
        name: name,
        pinned: pinned,
        archived: archived,
      });
    }
    handleClose();
  };

  const handleDeleteClick = () => {
    doDeleteList({ listId: currentList.id });
    handleClose();
  };

  const { mutate: doAddList } = useMutation({
    mutationFn: (data: addListRequest) => addList(data),
    onSuccess: (response) => {
      listsDispatch({ type: "SET_CURRENT_LIST_BY_ID", payload: response.id });
      queryClient.invalidateQueries({ queryKey: ["Lists"] });
    },
  });

  const { mutate: doUpdateList } = useMutation({
    mutationFn: (data: updateListRequest) => updateList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Lists"] });
    },
  });

  const { mutate: doDeleteList } = useMutation({
    mutationFn: (data: deleteListRequest) => deleteList(data),
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
                List Settings
              </Typography>
              {deleteEnabled && (
                <IconButton color="error" onClick={handleDeleteClick}>
                  <DeleteIcon />
                </IconButton>
              )}
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
              slotProps={{ htmlInput: { autoCapitalize: "sentences" } }}
            />
            <FormCheckbox
              control={control}
              label="pinned"
              id="pinned"
              name="pinned"
            />
            <FormCheckbox
              control={control}
              label="archived"
              id="archived"
              name="archived"
            />
          </Stack>
        </Form>
      </Dialog>
      {editCurrentList ? (
        <MenuItem onClick={handleOpen}>List Settings</MenuItem>
      ) : (
        <ListItem disablePadding>
          <ListItemButton onClick={handleOpen}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New list" />
          </ListItemButton>
        </ListItem>
      )}
    </>
  );
}
