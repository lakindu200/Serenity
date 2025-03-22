import React, { useState, useEffect, useRef } from "react";
import Nav from "./nav/nav";
import axios from "axios";
import "./Add product/product.css";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5002/users";

function DisplayProducts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const componentRef = useRef();

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(URL);
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${URL}/${id}`);
        console.log("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Handle update product
  const handleUpdate = (id) => {
    navigate(`/lpl/${id}`);
  };

  // Handle print/download
  const handlePrint = useReactToPrint({
    content: () => {
      console.log("Printing content:", componentRef.current);
      return componentRef.current;
    },
    documentTitle: "Product Details",
    onAfterPrint: () => console.log("Printed successfully"),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav />
      <button className="download-button" onClick={handlePrint}>
        Download Product Details
      </button>
      <div ref={componentRef}>
        {users && users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <h3>{user.Product_name}</h3>
              {user.image && (
                <img
                  src={`http://localhost:5002/${user.image}`}
                  alt={user.Product_name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "path/to/fallback/image.png";
                  }}
                />
              )}
              <p>Type: {user.product_type}</p>
              <p>Category: {user.Category}</p>
              <p>Size: {user.size}</p>
              <p>Material: {user.Material}</p>
              <p>Price: ${user.price}</p>
              <p>Stock Quantity: {user.stock_quantity}</p>
              <div className="button-group">
                <button
                  className="update-button"
                  onClick={() => handleUpdate(user._id)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}

export default DisplayProducts;