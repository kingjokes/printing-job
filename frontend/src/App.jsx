import "./assets/css/w3.css";


import { routes } from "./routes/routes";
import { Outlet, RouterProvider } from "react-router-dom";
function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Outlet />

    </>
  );
}

export default App;