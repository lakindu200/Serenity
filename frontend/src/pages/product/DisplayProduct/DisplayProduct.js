import React, { useState, useEffect } from "react";
import Nav from "../../../components/nav/nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "./DisplayProducts.css";
import { assets } from "../../../assets/assets";

const URL = "http://localhost:4000/api/product";

function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(URL);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to mark this product as inactive?")) {
      try {
        await axios.put(`${URL}/deactivate/${id}`);
        console.log("Product marked as inactive successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error marking product as inactive:", error);
      }
    }
  };
  const handleActive = async (id) => {
    if (window.confirm("Are you sure you want to active this product again?")) {
      try {
        await axios.put(`${URL}/activate/${id}`);
        console.log("Product marked as active successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error marking product as active:", error);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/admin/product/${id}`);
  };

  const currentDateTime = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleDownloadPDF = () => {
    if (loading) {
      console.warn("Cannot download while loading");
      return;
    }
    if (!products || products.length === 0) {
      console.warn("No products to download");
      return;
    }

    const tableRows = products
      .map(
        (product) => `
        <tr>
          <td>${product.Product_name}</td>
          <td>${product.product_type}</td>
          <td>${product.Category || "N/A"}</td>
          <td>${product.size || "N/A"}</td>
          <td>${product.Material || "N/A"}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.stock_quantity}</td>
          <td>${product.status === "active" ? "Published" : "Draft"}</td>
        </tr>
      `
      )
      .join("");


    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .container {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            h1 {
              font-weight: bold;
              font-size: 24px;
              margin-bottom: 10px;
            }
            p {
              font-size: 14px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Product List</h1>
            <p>Generated on: ${currentDateTime}</p>
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product Type</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Material</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;


    const opt = {
      margin: 1,
      filename: "Product_List.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(htmlContent).save();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  const handleSendReport = () => {
    const phoneNumber = "+94707238483";
    const message = "Selected Product Reports";
    const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsAppUrl, "_blank");
  };
  
  return (
    <div className="page-container">
      <Nav />
      <div className="content-container">
        <div className="header">
          <h1 className="title">Product List</h1>
          <button className="download-button" onClick={handleDownloadPDF}>
            Download Product Details
          </button>
          <button className="download-button" onClick={handleSendReport}>
            Send WhatsApp Message
          </button>
        </div>
        <div className="table-container">
          <table className="product-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">Product</th>
                <th className="table-cell">Created At</th>
                <th className="table-cell">Stock</th>
                <th className="table-cell">Price</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="table-row">
                    <td className="table-cell product-cell">
                      {product.image_path ? (
                        <img
                          src={`http://localhost:4000${product.image_path}`}
                          alt={product.Product_name}
                          className="product-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.noImage;
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      <div>
                        <p className="product-name">{product.Product_name}</p>
                        <p className="product-type">{product.product_type}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      {new Date(product.createdAt).toLocaleDateString()} <br />
                      {new Date(product.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="table-cell">
                      <div className="stock-container">
                        <div className="stock-bar">
                          <div
                            className={`stock-fill ${product.stock_quantity === 0
                              ? "stock-empty"
                              : product.stock_quantity <= 10
                                ? "stock-low"
                                : "stock-full"
                              }`}
                            style={{
                              width: `${product.stock_quantity > 100
                                ? 100
                                : product.stock_quantity
                                }%`,
                            }}
                          ></div>
                        </div>
                        <span className="stock-label">
                          {product.stock_quantity === 0
                            ? "out of stock"
                            : product.stock_quantity <= 10
                              ? `${product.stock_quantity} low`
                              : `${product.stock_quantity} in stock`}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">${product.price.toFixed(2)}</td>
                    <td className="table-cell">
                      <span
                        className={`status-label ${product.status === "active"
                          ? "status-active"
                          : "status-inactive"
                          }`}
                      >
                        {product.status === "active" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="action-button action-update"
                      >
                        Update
                      </button>
                      {
                        product.status === "active" && (
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="action-button action-delete"
                          >
                            Delete
                          </button>
                        )
                      }
                      {
                        product.status === "inactive" && (
                          <button
                            onClick={() => handleActive(product._id)}
                            className="action-button action-activate"
                          >
                            Activate
                          </button>
                        )
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="table-cell no-products">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DisplayProducts;