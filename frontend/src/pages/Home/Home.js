import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../product/ProductCard/ProductCard";
import ProductSkeleton from "../product/ProductCard/ProductSkeleton";
import "./Home.css";

const API_BASE_URL = "http://localhost:4000";

function Home() {
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/product`);
        const productsData = response.data.map((product) => ({
          ...product,
          id: product._id,
          name: product.Product_name,
          price: product.price,
          plu: `PLU-${product._id.slice(-6)}`,
          image: `${API_BASE_URL}${product.image_path}`,
          stock: product.stock_quantity > 0 ? "In stock" : "Out of stock",
        }));

        const sortedProducts = [...productsData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const newArrivalProducts = sortedProducts.slice(0, 4);

        const groupedByCategory = productsData.reduce((acc, product) => {
          const category = product.Category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        setProducts(productsData);
        setNewArrivals(newArrivalProducts);
        setProductsByCategory(groupedByCategory);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/product`);
        const productsData = response.data.map((product) => ({
          ...product,
          id: product._id,
          name: product.Product_name,
          price: product.price,
          plu: `PLU-${product._id.slice(-6)}`,
          image: `${API_BASE_URL}${product.image_path}`,
          stock: product.stock_quantity > 0 ? "In stock" : "Out of stock",
        }));

        const sortedProducts = [...productsData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const newArrivalProducts = sortedProducts.slice(0, 5);

        const groupedByCategory = productsData.reduce((acc, product) => {
          const category = product.Category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        setProducts(productsData);
        setNewArrivals(newArrivalProducts);
        setProductsByCategory(groupedByCategory);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };
    fetchProducts();
  };

  if (error) {
    return (
      <div className="home-container">
        
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-btn">
          Retry
        </button>
        
      </div>
    );
  }

  return (
    <div className="home-container">
      

      <section className="new-arrivals-section">
        <h1>New Arrivals</h1>
        <div className="product-grid">
          {loading
            ? Array(5)
              .fill()
              .map((_, index) => <ProductSkeleton key={index} />)
            : newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
              />
            ))}
        </div>
      </section>

      <section className="category-section">
        <h1>Shop by Category</h1>
        {Object.keys(productsByCategory).map((category) => (
          <div key={category} className="category-block">
            <h2>{category}</h2>
            <div className="product-grid">
              {loading
                ? Array(3)
                  .fill()
                  .map((_, index) => <ProductSkeleton key={index} />)
                : productsByCategory[category].map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    navigate={navigate}
                  />
                ))}
            </div>
          </div>
        ))}
      </section>

      
    </div>
  );
}

export default Home;