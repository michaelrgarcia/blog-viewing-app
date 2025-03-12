import { RouteObject } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";

import App from "./components/App/App";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
  },
  {
    path: "login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "register",
    element: (
      <AuthProvider>
        <Register />
      </AuthProvider>
    ),
  },
];

export default routes;
