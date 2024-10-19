import loadable from "@loadable/component";
import { createBrowserRouter, useRouteError } from "react-router-dom";


const Home = loadable(() => import("../views/home.jsx"));
const Index = loadable(() => import("../views/index.jsx"));
const Admin = loadable(() => import("../views/admin.jsx"));

export const routes = createBrowserRouter([
  {
    path: "",
    element: <Index />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
 
    ]
  },



]);