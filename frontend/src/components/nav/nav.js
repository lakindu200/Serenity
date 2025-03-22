import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/lpl">Display Products</Link>
        </li>
        <li>
          <Link to="/asd">Add Product</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav; // Ensure Nav is exported as the default export