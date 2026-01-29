import AddIcon from "@mui/icons-material/Add";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import SaveIcon from "@mui/icons-material/Save";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import {
  AppBar,
  Dialog,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
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
import FormTextField from "./form/FormTextField";
import FormToggleButton from "./form/FormToggleButton.tsx";

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
      reset({
        name: currentList.name,
        pinned: currentList.pinned,
        archived: currentList.archived,
      });
    setOpen(true);
  };
  const handleClose = () => {
    reset();
    setOpen(false);
    if (clearActionMenu !== undefined) clearActionMenu();
  };

  const handleSaveClick = ({
    name,
    pinned,
    archived,
  }: {
    name: string;
    pinned: boolean;
    archived: boolean;
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
          <Stack pt="2rem" px="1rem" gap={1}>
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
            <FormToggleButton
              control={control}
              id="pinned"
              name="pinned"
              value="pinned"
              sx={{ maxWidth: "sm" }}
              activeLabel={
                <Stack direction="row" alignItems="center">
                  <PushPinOutlinedIcon sx={{ transform: "rotate(-45deg)" }} />
                  <Typography>Pinned</Typography>
                </Stack>
              }
              inactiveLabel={
                <Stack direction="row" alignItems="center">
                  <PushPinOutlinedIcon />
                  <Typography>Not Pinned</Typography>
                </Stack>
              }
            />
            <FormToggleButton
              control={control}
              id="archived"
              name="archived"
              value="archived"
              sx={{ maxWidth: "sm" }}
              activeLabel={
                <Stack direction="row" alignItems="center">
                  <UnarchiveOutlinedIcon />
                  <Typography>Archived</Typography>
                </Stack>
              }
              inactiveLabel={
                <Stack direction="row" alignItems="center">
                  <ArchiveOutlinedIcon />
                  <Typography>Not Archived</Typography>
                </Stack>
              }
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
