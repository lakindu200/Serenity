import React, { useState } from "react";
import Nav from "../nav/nav"; // Keep the Nav component
import axios from "axios"; // Import axios for HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./product.css";

function Product() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [product, setProduct] = useState({
    Product_name: "",
    product_type: "",
    Category: "",
    size: "",
    Material: "",
    price: "",
    stock_quantity: "",
  });

  const [image, setImage] = useState(null); // State for the uploaded image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting product:", product);

    const formData = new FormData();
    formData.append("Product_name", product.Product_name);
    formData.append("product_type", product.product_type);
    formData.append("Category", product.Category);
    formData.append("size", product.size);
    formData.append("Material", product.Material);
    formData.append("price", product.price);
    formData.append("stock_quantity", product.stock_quantity);
    if (image) {
      formData.append("image", image); // Append the image file
    }

    try {
      await axios.post("http://localhost:5002/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/lpl"); // Navigate to the DisplayProducts page after successful submission
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
 


  return (
    <div>
      <Nav /> {/* Render the Nav component */}
      <h1>Add Product</h1>
      <div>
        <form onSubmit={handleSubmit} className="product-form">
          <h2>Add a New Product</h2>
          <div className="form-group">
            <label htmlFor="Product_name">Product Name:</label>
            <input
              type="text"
              id="Product_name"
              name="Product_name"
              value={product.Product_name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="product_type">Product Type:</label>
            <select
              id="product_type"
              name="product_type"
              value={product.product_type}
              onChange={handleChange}
              required
            >
              <option value="">Select product type</option>
              <option value="Mattress">Mattress</option>
              <option value="Pillow">Pillow</option>
              <option value="Bedding Accessory">Bedding Accessory</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="Category">Category:</label>
            <select
              id="Category"
              name="Category"
              value={product.Category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Luxury">Luxury</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Cooling">Cooling</option>
              <option value="Budget-Friendly">Budget-Friendly</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="size">Size:</label>
            <select
              id="size"
              name="size"
              value={product.size}
              onChange={handleChange}
              required
            >
              <option value="">Select size</option>
              <option value="Twin">Twin</option>
              <option value="Full">Full</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="Standard">Standard</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="Material">Material:</label>
            <input
              type="text"
              id="Material"
              name="Material"
              value={product.Material}
              onChange={handleChange}
              placeholder="Enter material (e.g., Memory Foam)"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock_quantity">Stock Quantity:</label>
            <input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={product.stock_quantity}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <button type="submit" className="submit-button">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default Product;