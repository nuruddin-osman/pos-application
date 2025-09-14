import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./layouts/RootLayout";
import DruftApi from "./components/DruftApi";
import { AlertProvider } from "./components/AlertMessage";

const App = () => {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <RootLayout />,
        },
      ],
    },
    {
      path: "/asdf",
      element: <DruftApi />,
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
