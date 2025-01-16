import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import SignIn from "./pages/SignIn/SignIn";
import ListsProvider from "./providers/ListsProvider";

const routerConfig = [
  {
    path: "/",
    element: (
      <ListsProvider>
        <Home />
      </ListsProvider>
    ),
  },
  {
    path: "/settings",
    element: (
      <ListsProvider>
        <Settings />
      </ListsProvider>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
];

export default createBrowserRouter(routerConfig);
