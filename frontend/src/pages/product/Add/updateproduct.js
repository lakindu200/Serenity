import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../../../components/nav/nav";
import "./product.css";

const URL = "http://localhost:4000/api/product"; 

function UpdateProduct() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    Product_name: "",
    product_type: "",
    Category: "",
    size: "",
    Material: "",
    price: "",
    stock_quantity: "",
  });

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(""); 
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`${URL}/${id}`)
      .then((res) => {
        setProduct(res.data); 
        setExistingImage(res.data.image_path); 
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!product.Product_name.trim()) newErrors.Product_name = "Product name is required";
    if (!product.product_type) newErrors.product_type = "Product type is required";
    if (!product.Category) newErrors.Category = "Category is required";
    if (!product.size) newErrors.size = "Size is required";
    if (!product.Material.trim()) newErrors.Material = "Material is required";

    const priceValue = parseFloat(product.price);
    if (!product.price || isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Valid price greater than 0 is required";
    }

    const stockValue = parseInt(product.stock_quantity);
    if (!product.stock_quantity || isNaN(stockValue) || stockValue < 0) {
      newErrors.stock_quantity = "Valid stock quantity (0 or more) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      console.log("Validation failed:", errors);
      return;
    }

    const formData = new FormData();
    formData.append("Product_name", product.Product_name.trim());
    formData.append("product_type", product.product_type);
    formData.append("Category", product.Category);
    formData.append("size", product.size);
    formData.append("Material", product.Material.trim());
    formData.append("price", product.price); 
    formData.append("stock_quantity", product.stock_quantity); 
    formData.append("status", product.status || "active"); 
    if (image) formData.append("image", image); 

    try {
      const response = await axios.put(`${URL}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product updated:", response.data);
      navigate("/admin/product");
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      setErrors({ submit: error.response?.data?.message || "Failed to update product" });
    }
  };

  return (
    <div>
      <Nav />
      <h1>Update Product</h1>
      <div>
        <form onSubmit={handleSubmit} className="product-form">
          <h2>Update Product</h2>
          {errors.submit && <p className="error">{errors.submit}</p>}

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
            {errors.Product_name && <span className="error">{errors.Product_name}</span>}
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
            {errors.product_type && <span className="error">{errors.product_type}</span>}
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
            {errors.Category && <span className="error">{errors.Category}</span>}
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
            {errors.size && <span className="error">{errors.size}</span>}
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
            {errors.Material && <span className="error">{errors.Material}</span>}
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
              min="0.01"
              step="0.01"
              required
            />
            {errors.price && <span className="error">{errors.price}</span>}
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
              min="0"
              step="1"
              required
            />
            {errors.stock_quantity && <span className="error">{errors.stock_quantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image:</label>
            { existingImage && (
              <div>
                <p>Current Image: <a href={`http://localhost:4000${existingImage}`} target="_blank" rel="noopener noreferrer">View Image</a></p>
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
            />
            {errors.image && <span className="error">{errors.image}</span>}
          </div>

          <button type="submit" className="submit-button">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;