import SearchBar from "./searchbar/SearchBar";
import { RecordInfo } from "../../types/GeneralTypes";
import { dummyRecords } from "../../DummyRecords";

import { Link } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const handleSearch = (record: RecordInfo) => {
    console.debug(record.ENname);
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
          allRecords={dummyRecords}
          callback={handleSearch}
        />
      </div>
      <div className="navbar-right">
        <ul className="navbar-links-right">
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
