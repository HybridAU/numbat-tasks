import RequireAuth from "@auth-kit/react-router/RequireAuth";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import SignIn from "./pages/SignIn/SignIn";
import ListsProvider from "./providers/ListsProvider";

const routerConfig = [
  {
    path: "/",
    element: (
      <RequireAuth fallbackPath="/sign-in">
        <ListsProvider>
          <Home />
        </ListsProvider>
      </RequireAuth>
    ),
  },
  {
    path: "/settings",
    element: (
      <RequireAuth fallbackPath="/sign-in">
        <ListsProvider>
          <Settings />
        </ListsProvider>
      </RequireAuth>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
];

export default createBrowserRouter(routerConfig);
