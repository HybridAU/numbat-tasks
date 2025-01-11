import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const handleSignOut = () => {
    signOut();
    navigate("/sign-in");
  };

  return (
    <>
      <Stack direction="column" sx={{ alignItems: "flex-start" }}>
        <Button onClick={handleSignOut} startIcon={<LogoutIcon />}>
          Logout
        </Button>
      </Stack>
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography ml="2rem" variant="h6" component="div">
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
