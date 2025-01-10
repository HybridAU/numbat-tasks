import RequireAuth from "@auth-kit/react-router/RequireAuth";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ListsProvider from "./providers/ListsProvider.tsx";

const Home = lazy(() => import("./pages/Home/Home"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const SignIn = lazy(() => import("./pages/SignIn/SignIn"));

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
