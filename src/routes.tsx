/* eslint-disable react-refresh/only-export-components */

import { lazy } from "@loadable/component";
import Default from "./layouts/Default";
import AuthLayout from "./layouts/Auth";
import { RouteProtector } from "./components/guard/RouteProtector";

const Home = lazy(() => import("./pages/home/Index"));

const Incite = lazy(() => import("./pages/home/IndexOfficial"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Login = lazy(() => import("./pages/auth/Login"));
const AuxMap = lazy(() => import("./pages/aux_MapPositioning"));


// . . . . . . . . . ➤



// . . . . . . . . . ➤

const routes = [
  {
    path: "/",
    element: (
      <Default />
    ),
    children: [
      {
        path: "dashboard", // [ROUTE]  /
        element: <Home />,
      },


      {
        path: "", // [ROUTE]  /
        element: <Incite />,
      },


      {
        path: "settings", // [ROUTE] /settings
        element: (
          <RouteProtector>
            <Settings />
          </RouteProtector>
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
