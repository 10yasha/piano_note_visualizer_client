import { createBrowserRouter, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import SearchBar from "../searchbar/SearchBar";
import { RecordingInfo } from "../../types/GeneralTypes";

import HomePage from "../../pages/Home/HomePage.tsx";
import BrowsePage from "../../pages/Browse/BrowsePage.tsx";
import AboutPage from "../../pages/About/AboutPage.tsx";
import ManagePage from "../../pages/Manage/ManagePage.tsx";
import LoginPage from "../../pages/Login/LoginPage.tsx";
import NotFoundPage from "../../pages/NotFound/NotFoundPage.tsx";
import Visualizer from "../../pages/Visualizer/Visualizer.tsx";

import { useAllRecordings } from "../../hooks/useAllRecordings";

import "./Navbar.css";

import { Outlet } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../../api/api.ts";

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
        path: "/manage",
        element: <ManagePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);

function Navbar() {
  const records = useAllRecordings();

  const handleSearch = (recording: RecordingInfo) => {
    console.debug(recording.enName);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul className="navbar-links-left">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/browse">Browse</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-middle">
        <SearchBar
          placeholder="search..."
          allRecords={records}
          callback={handleSearch}
        />
      </div>
      <div className="navbar-right">
        <ul className="navbar-links-right">
          <li>
            <Link to="/manage">Manage</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default router;
