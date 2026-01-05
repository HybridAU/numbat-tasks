import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    h1: {
      fontSize: "1.5rem",
    },
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#552200",
    },
    secondary: {
      main: "#ffe6d5",
    },
  },
});

export default theme;
