import RequireAuth from "@auth-kit/react-router/RequireAuth";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const SignIn = lazy(() => import("./pages/SignIn/SignIn"));

const routerConfig = [
  {
    path: "/",
    element: (
      <RequireAuth fallbackPath="/sign-in">
        <HomePage />
      </RequireAuth>
    ),
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
];

export default createBrowserRouter(routerConfig);
