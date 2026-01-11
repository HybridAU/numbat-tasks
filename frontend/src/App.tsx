import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import AuthenticationProvider from "./providers/AuthenticationProvider";
import router from "./router";
import theme from "./theme/theme";

function App() {
  const queryClient = new QueryClient();
  return (
    <AuthenticationProvider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthenticationProvider>
  );
}

export default App;
