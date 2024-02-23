import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// I'm pretty sure this is a false positive based on
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347
/* eslint-disable react-refresh/only-export-components */
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));

const routerConfig = [
  {
    path: '/',
    element: <SignIn />,
  },
];

export default createBrowserRouter(routerConfig);
