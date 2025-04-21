import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SingleProductSkeleton from "./SingleProductSkeleton";
import "./SingleProduct.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { assets } from "../../../assets/assets";

const API_BASE_URL = "http://localhost:4000";

function SingleProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/api/product/${id}`);
                const productData = {
                    ...response.data,
                    id: response.data._id,
                    name: response.data.Product_name,
                    price: response.data.price,
                    plu: `PLU-${response.data._id.slice(-6)}`,
                    image: `${API_BASE_URL}${response.data.image_path}`,
                    stock: response.data.stock_quantity > 0 ? "In stock" : "Out of stock",
                };
                setProduct(productData);
                setLoading(false);
            } catch (err) {
                setError("Failed to load product. Please try again.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products/${id}`);
                const productData = {
                    ...response.data,
                    id: response.data._id,
                    name: response.data.Product_name,
                    price: response.data.price,
                    plu: `PLU-${response.data._id.slice(-6)}`,
                    image: `${API_BASE_URL}${response.data.image_path}`,
                    stock: response.data.stock_quantity > 0 ? "In stock" : "Out of stock",
                };
                setProduct(productData);
                setLoading(false);
            } catch (err) {
                setError("Failed to load product. Please try again.");
                setLoading(false);
            }
        };
        fetchProduct();
    };

    if (loading) {
        return <SingleProductSkeleton />;
    }

    if (error) {
        return (
            <div className="single-product-container">
                <p>{error}</p>
                <button onClick={handleRetry} className="retry-btn">
                    Retry
                </button>
                <button onClick={() => navigate("/")} className="back-btn">
                    Back to Shop
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="single-product-container">
                <p>Product not found.</p>
                <button onClick={() => navigate("/")} className="back-btn">
                    Back to Shop
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="home-container">
                <Header />

                <div className="single-product-container">

                    <div className="single-product">
                        <img src={product.image}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = assets.noImage;
                            }}
                            alt={product.name} className="single-product-image" />
                        <div className="single-product-details">
                            <h2>{product.name}</h2>
                            <p className="plu">PLU: {product.plu}</p>
                            <p className="price-main mb-20">Rs.{product.price.toLocaleString()}.00</p>
                            <p className="price mb-20">Category: {product.Category}</p>
                            <p className="price mb-20">Type: {product.product_type}</p>
                            <p className="price mb-20">Size: {product.size}</p>
                            <p className="stock-status mb-20">
                                {`${product.stock} - (${product.stock_quantity >= 1 && product.stock_quantity} available)`}
                            </p>
                            <div className="add-to-cart-section">
                                <input type="number" defaultValue={1} min={1} className="quantity-input" />
                                <button className="add-to-cart-btn">Add to cart</button>
                            </div>
                            <button onClick={() => navigate("/shop")} className="back-btn-1">
                                Back to Shop
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div >
        </>
    );
}

export default SingleProduct;