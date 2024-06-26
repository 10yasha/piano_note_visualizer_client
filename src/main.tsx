import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./components/navbar/Navbar.tsx";

import HomePage from "./pages/Home/HomePage.tsx";
import BrowsePage from "./pages/Browse/BrowsePage.tsx";
import AboutPage from "./pages/About/AboutPage.tsx";
import AdminPage from "./pages/Admin/AdminPage.tsx";
import NotFoundPage from "./pages/NotFound/NotFoundPage.tsx";
import Visualizer from "./pages/Visualizer/Visualizer.tsx";

import App from "./App.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/browse",
    element: <BrowsePage />,
  },
  {
    path: "/browse/:recordENname",
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Navbar */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
