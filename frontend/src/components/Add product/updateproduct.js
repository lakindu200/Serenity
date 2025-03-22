import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const URL = "http://localhost:5002/users";

function UpdateProduct() {
  const { id } = useParams(); // Get the product ID from the route
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

  // Fetch product details by ID
  useEffect(() => {
    axios.get(`${URL}/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL}/${id}`, product); // Send PUT request to update the product
      console.log("Product updated successfully!");
      navigate("/lpl"); // Navigate back to the DisplayProducts page
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Product_name"
          value={product.Product_name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        {/* Add other input fields for product details */}
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateProduct;