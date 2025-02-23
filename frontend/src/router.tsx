import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import { AuthenticationSpinner } from "./providers/AuthenticationProvider";
import ListsProvider from "./providers/ListsProvider";

const routerConfig = [
  {
    path: "/",
    element: (
      <AuthenticationSpinner>
        <ListsProvider>
          <Home />
        </ListsProvider>
      </AuthenticationSpinner>
    ),
  },
  {
    path: "/settings",
    element: (
      <AuthenticationSpinner>
        <ListsProvider>
          <Settings />
        </ListsProvider>
      </AuthenticationSpinner>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
];

export default createBrowserRouter(routerConfig);
