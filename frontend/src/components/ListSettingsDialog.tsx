import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import type { TransitionProps } from "@mui/material/transitions";
import { useState } from "react";
import * as React from "react";

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
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        disableRestoreFocus
        TransitionComponent={Transition}
      >
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
              // onClick={() =>
              //   doDeleteTask({
              //     authHeader: authHeader,
              //     listId: currentList.id,
              //     taskId: task.id,
              //   })
              // }
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="inherit"
              type="submit"
              // onClick={handleSubmit((data) => {
              //   handleSaveClick(data.text);
              // })}
            >
              <SaveIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Dialog>
      <MenuItem onClick={handleClick}>List Settings</MenuItem>
    </>
  );
}
