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
    // <nav className="navbar">
    //   <div className="navbar-logo">
    //     <Link to="/">MyApp</Link>
    //   </div>
    //   <ul className="navbar-links">
    //     <li>
    //       <Link to="/">Home</Link>
    //     </li>
    //     <li>
    //       <Link to="/about">About</Link>
    //     </li>
    //     <li>
    //       <Link className="navbar-item" to="/contact">
    //         Contact
    //       </Link>
    //     </li>
    //   </ul>
    // </nav>
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-item">Home</button>
        <button className="navbar-item">Browse</button>
        <button className="navbar-item">About</button>
      </div>
      <div className="navbar-middle">
        <SearchBar
          placeholder="search..."
          allRecords={dummyRecords}
          callback={handleSearch}
        />
      </div>
      <div className="navbar-right">
        <button className="navbar-item">Admin</button>
      </div>
    </nav>
  );
}

export default Navbar;
