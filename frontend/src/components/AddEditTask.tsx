import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Dialog,
  Fab,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as React from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Form, useForm } from "react-hook-form";
import { addTask, type addTaskRequest } from "../api/tasks.ts";
import { useListsState } from "../providers/ListsProvider.tsx";
import FormTextField from "./form/FormTextField.tsx";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddEditTask() {
  const queryClient = useQueryClient();
  const { currentList } = useListsState();
  const authHeader = useAuthHeader();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { task: "" },
  });
  const { mutate } = useMutation({
    mutationFn: (data: addTaskRequest) => addTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
      handleClose();
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
                Add Task
              </Typography>
              <IconButton
                color="inherit"
                type="submit"
                onClick={handleSubmit((data) => {
                  mutate({
                    text: data.task,
                    listId: currentList?.id,
                    authHeader: authHeader,
                  });
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
              label="Task Name"
              variant="outlined"
              id="task"
              name="task"
            />
          </Stack>
        </Form>
      </Dialog>
      <StyledFab color="secondary" aria-label="add">
        <AddIcon onClick={handleClickOpen} />
      </StyledFab>
    </>
  );
}
