import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/admin/product">Display Products</Link>
        </li>
        <li>
          <Link to="/admin/product/add-product">Add Product</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;