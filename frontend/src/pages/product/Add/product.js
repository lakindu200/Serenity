import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./product.css";
import Nav from "../../../components/nav/nav";

function Product() {
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = product.Product_name.trim();
    const trimmedMaterial = product.Material.trim();

    if (!trimmedName) newErrors.Product_name = "Product name is required";
    if (!product.product_type) newErrors.product_type = "Product type is required";
    if (!product.Category) newErrors.Category = "Category is required";
    if (!product.size) newErrors.size = "Size is required";
    if (!trimmedMaterial) newErrors.Material = "Material is required";

    const priceValue = parseFloat(product.price);
    if (!product.price || isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    const stockValue = parseInt(product.stock_quantity, 10);
    if (!product.stock_quantity || isNaN(stockValue) || stockValue < 0) {
      newErrors.stock_quantity = "Stock must be 0 or greater";
    }

    if (!image) {
      newErrors.image = "Product image is required";
    } else {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        newErrors.image = "Only JPG, JPEG, PNG, and WEBP files are allowed";
      }
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file && !allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Invalid file type!" }));
      setImage(null);
      e.target.value = "";
    } else {
      setImage(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:4000/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/product");
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to add product" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Nav />
      <h1>Add Product</h1>
      <div>
        <form onSubmit={handleSubmit} className="product-form">
          <h2>Add a New Product</h2>
          {errors.submit && <p className="error">{errors.submit}</p>}

          <div className="form-group">
            <label htmlFor="Product_name">Product Name:</label>
            <input type="text" id="Product_name" name="Product_name" value={product.Product_name} onChange={handleChange} placeholder="Enter product name" />
            {errors.Product_name && <span className="error">{errors.Product_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="product_type">Product Type:</label>
            <select id="product_type" name="product_type" value={product.product_type} onChange={handleChange}>
              <option value="">Select product type</option>
              <option value="Mattress">Mattress</option>
              <option value="Pillow">Pillow</option>
              <option value="Bedding Accessory">Bedding Accessory</option>
            </select>
            {errors.product_type && <span className="error">{errors.product_type}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="Category">Category:</label>
            <select id="Category" name="Category" value={product.Category} onChange={handleChange}>
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
            <select id="size" name="size" value={product.size} onChange={handleChange}>
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
            <input type="text" id="Material" name="Material" value={product.Material} onChange={handleChange} placeholder="Enter material (e.g., Memory Foam)" />
            {errors.Material && <span className="error">{errors.Material}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input type="number" id="price" name="price" value={product.price} onChange={handleChange} placeholder="Enter price" min="0.01" step="0.01" />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock_quantity">Stock Quantity:</label>
            <input type="number" id="stock_quantity" name="stock_quantity" value={product.stock_quantity} onChange={handleChange} placeholder="Enter stock quantity" min="0" />
            {errors.stock_quantity && <span className="error">{errors.stock_quantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image:</label>
            <input type="file" id="image" name="image" onChange={handleFileChange} accept="image/jpeg,image/jpg,image/png,image/webp" />
            {errors.image && <span className="error">{errors.image}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Product;
