import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home/HomePage.tsx";
import BrowsePage from "./pages/Browse/BrowsePage.tsx";
import AboutPage from "./pages/About/AboutPage.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import NotFoundPage from "./pages/NotFound/NotFoundPage.tsx";
import Visualizer from "./pages/Visualizer/Visualizer.tsx";

import Navbar from "./components/navbar/Navbar.tsx";

import "./index.css";

import { Outlet } from "react-router-dom";

function NavbarWrapper() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarWrapper />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/browse",
        element: <BrowsePage />,
      },
      {
        path: "/browse/:recordurl",
        element: <Visualizer />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
