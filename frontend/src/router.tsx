import RequireAuth from "@auth-kit/react-router/RequireAuth";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// I'm pretty sure this is a false positive based on
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347
/* eslint-disable react-refresh/only-export-components */
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
