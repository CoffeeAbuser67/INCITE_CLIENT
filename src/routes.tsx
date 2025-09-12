/* eslint-disable react-refresh/only-export-components */

import { lazy } from "@loadable/component";
import DefaultLayout from "./layouts/Default";
import LandingLayout from "./layouts/Landing";
import { RouteProtector } from "./components/guard/RouteProtector";


const Dashboard = lazy(() => import("./pages/dashboard/Index"));
const Home = lazy(() => import("./pages/home/Index"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Login = lazy(() => import("./pages/auth/Login"));
const AuxMap = lazy(() => import("./pages/aux_MapPositioning"));
const BlogPage = lazy(() => import("./pages/blog/BlogPage"));
const PostDetailPage = lazy(() => import("./pages/blog/PostDetailPage"));
const InstituicaoProfilePage = lazy(() => import("./pages/instituicao/Profile"));



const routes = [

  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        path: "", // [ROUTE]  /
        element: <Home />,
      },
    ],
  },



  {
    path: "/",
    element: (
      <DefaultLayout />
    ),
    children: [
      {
        path: "dashboard", // [ROUTE]  /dashboard
        element: <Dashboard />,
      },

      {
        path: 'blog', // [ROUTE] /blog
        element: <BlogPage />,
      },

      {
        path: 'blog/:id', // [ROUTE]  /blog/:id
        element: <PostDetailPage />,
      },

      {
        path: 'instituicao/:id', // [ROUTE] /instituicao/:id
        element: <InstituicaoProfilePage />,
      },

      {
        path: "settings", // [ROUTE] /settings
        element: (
          <RouteProtector>
            <Settings />
          </RouteProtector>
        ),
      },

      { // WARN - To remove in Production
        path: "auxMapPos", // [ROUTE] /auxMapPos
        element: (
          <AuxMap />
        ),
      },


    ],
  },


  {
    path: "/auth/",
    element: <DefaultLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },




];

export default routes;
