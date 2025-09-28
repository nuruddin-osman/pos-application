import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./layouts/RootLayout";
import { AlertProvider } from "./components/AlertMessage";
import Register from "./pages/register/Index";
import Login from "./pages/login/Index";

const App = () => {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </>
  );
};

export default App;
