import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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
import * as React from "react";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import {
  addTask,
  type addTaskRequest,
  deleteTask,
  type deleteTaskRequest,
  type TaskDetails,
  updateTask,
  type updateTaskRequest,
} from "../api/tasks";
import { useListsState } from "../providers/ListsProvider";
import FormTextField from "./form/FormTextField";
import LinkifyText from "./LinkifyText.tsx";

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

type AddEditTaskProps = {
  task?: TaskDetails;
};

export default function AddEditTask({ task }: AddEditTaskProps) {
  const queryClient = useQueryClient();
  const { currentList } = useListsState();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    if (task) {
      setValue("text", task.text || "");
    }
    setOpen(true);
  };

  const handleSaveClick = (text: string) => {
    if (task?.id) {
      doUpdateTask({
        listId: currentList.id,
        taskId: task.id,
        text: text,
      });
    } else {
      doAddTask({
        text: text,
        listId: currentList.id,
      });
    }
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: { text: "" },
  });

  const { mutate: doAddTask } = useMutation({
    mutationFn: (data: addTaskRequest) => addTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
      handleClose();
    },
  });
  const { mutate: doDeleteTask } = useMutation({
    mutationFn: (data: deleteTaskRequest) => deleteTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentList.id] });
      handleClose();
    },
  });
  const { mutate: doUpdateTask } = useMutation({
    mutationFn: (data: updateTaskRequest) => updateTask(data),
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
                Add Task
              </Typography>
              {task?.id && (
                <IconButton
                  color="error"
                  onClick={() =>
                    doDeleteTask({
                      listId: currentList.id,
                      taskId: task.id,
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              )}
              <IconButton
                color="inherit"
                type="submit"
                onClick={handleSubmit((data) => {
                  handleSaveClick(data.text);
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
              id="text"
              name="text"
              slotProps={{ htmlInput: { autoCapitalize: "sentences" } }}
            />
          </Stack>
        </Form>
      </Dialog>
      {task?.id ? (
        <Stack
          // Adds some padding, so when it's a single line the text is centered vertically
          // (aligned with the checkbox) but when it's multiple lines the text lines up with the
          // top of the checkbox.
          justifyContent="center"
          direction="column"
          minHeight="35px"
          marginBottom="7px"
          // By putting the onClick on the stack rather than the typography, and making it full width
          // we make it easier to click on tasks to edit them. This is especially important when the
          // whole text of the task is a link
          flex={1}
          onClick={handleClickOpen}
        >
          <Typography
            align="left"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "4",
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
            }}
            color={task.complete ? "text.secondary" : "text.primary"}
          >
            <LinkifyText text={task.text} />
          </Typography>
        </Stack>
      ) : (
        <StyledFab color="secondary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </StyledFab>
      )}
    </>
  );
}
