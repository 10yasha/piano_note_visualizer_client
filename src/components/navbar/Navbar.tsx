import React from "react";

import SearchBar from "./searchbar/SearchBar";
import { RecordInfo } from "../../../types/GeneralTypes";

import "./Navbar.css";

function Navbar() {
  const handleSearch = (record: RecordInfo) => {
    console.log(record.ENname);
  };

  const dummyRecords: RecordInfo = [
    {
      id: "a",
      ENname: "FFXIII - Saber's Edge",
      JPfname: "c",
      JPhname: "c",
      type: "vgm",
      tags: "FFXIII",
    },
    {
      id: "b",
      ENname: "Persona 3 - Color Your Night",
      JPfname: "d",
      JPhname: "d",
      type: "vgm",
      tags: "Persona 3",
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-btn">Home</button>
      </div>
      <div className="navbar-middle">
        <SearchBar
          placeholder="search..."
          allRecords={dummyRecords}
          callback={handleSearch}
        />
      </div>
      <div className="navbar-right">
        <button className="navbar-btn">Admin</button>
      </div>
    </nav>
  );
}

export default Navbar;
