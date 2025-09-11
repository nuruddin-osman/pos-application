import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home/Index";
import RootLayout from "./layouts/RootLayout";
import Register from "./pages/registration/Index";
import PatientManagement from "./pages/patient-management/Index";

const App = () => {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/patient-management",
          element: <PatientManagement />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />,
    </>
  );
};

export default App;
