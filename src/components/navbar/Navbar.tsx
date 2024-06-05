import React from "react";

import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button>Home</button>
      </div>
      <div className="navbar-middle">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="navbar-right">
        <button>Admin</button>
      </div>
    </nav>
  );
}

export default Navbar;
