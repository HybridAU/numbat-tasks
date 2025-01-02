import RequireAuth from "@auth-kit/react-router/RequireAuth";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ListsProvider from "./providers/ListsProvider.tsx";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const SignIn = lazy(() => import("./pages/SignIn/SignIn"));

const routerConfig = [
  {
    path: "/",
    element: (
      <RequireAuth fallbackPath="/sign-in">
        <ListsProvider>
          <HomePage />
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
