/* eslint-disable react-refresh/only-export-components */

import { lazy } from "@loadable/component";
import Default from "./layouts/Default";
import AuthLayout from "./layouts/Auth";
import RouteProtector from "./components/guard/RouteProtector";

const Home = lazy(() => import("./pages/home/Home"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Login = lazy(() => import("./pages/auth/Login"));

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
        element: <Home/>,
      },
      
      
      {
        path: "settings", // [ROUTE] /settings
        element: (
          <RouteProtector allowedRoles={[ ROLES.Admin, ROLES.Super]}>
            <Settings />
          </RouteProtector>
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
