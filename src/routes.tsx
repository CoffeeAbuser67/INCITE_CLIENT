/* eslint-disable react-refresh/only-export-components */

import { lazy } from "@loadable/component";
import Default from "./layouts/Default";
import AuthLayout from "./layouts/Auth";

const Home = lazy(() => import("./pages/home/Index"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Login = lazy(() => import("./pages/auth/Login"));
const AuxMap = lazy(() => import("./pages/aux_MapPositioning"));


// . . . . . . . . . ➤


// [●] ROLES
const ROLES = {
  User: 4,
  Staff: 3,
  Admin: 2,
  Super: 1
};

// . . . . . . . . . ➤

const routes = [
  {
    path: "/",
    element: (
      <Default />
    ),
    children: [
      {
        path: "", // [ROUTE]  /
        element: <Home />,
      },


      {
        path: "settings", // [ROUTE] /settings
        element: (
          <Settings />
        ),
      },


      {
        path: "auxMapPos", // [ROUTE] /auxMapPos
        element: (
          <AuxMap />
        ),
      },



    ],
  },

  {
    path: "/auth/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
];

export default routes;
