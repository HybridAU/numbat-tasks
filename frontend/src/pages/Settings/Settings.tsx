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
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getConfig } from "../../api/config.ts";
import { useAuthenticationsDispatch } from "../../providers/AuthenticationProvider.tsx";

export default function Settings() {
  const navigate = useNavigate();
  const authenticationsDispatch = useAuthenticationsDispatch();
  const handleSignOut = () => {
    authenticationsDispatch({ type: "SET_LOGGED_OUT", payload: null });
    navigate("/sign-in");
  };
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => getConfig(),
  });

  return (
    <>
      <Stack direction="column" sx={{ alignItems: "flex-start" }}>
        <Typography>Version: {config?.version}</Typography>
        <Typography>
          Signup Enabled: {config?.signup_enabled?.toString()}
        </Typography>
        <Button
          onClick={handleSignOut}
          startIcon={<LogoutIcon />}
          sx={{ paddingTop: "10px" }}
        >
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
