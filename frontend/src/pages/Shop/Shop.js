import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../product/ProductCard/ProductCard";
import ProductSkeleton from "../product/ProductCard/ProductSkeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Shop.css";

const API_BASE_URL = "http://localhost:4000";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [filters, setFilters] = useState({
    product_type: "",
    Category: "",
    size: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (filters.product_type) queryParams.append("product_type", filters.product_type);
        if (filters.Category) queryParams.append("Category", filters.Category);
        if (filters.size) queryParams.append("size", filters.size);
        if (sortOption !== "default") queryParams.append("sort", sortOption);

        const response = await axios.get(`${API_BASE_URL}/api/product/filtered?${queryParams.toString()}`);

        const productsData = response.data.map((product) => ({
          ...product,
          id: product._id,
          name: product.Product_name,
          price: product.price,
          plu: `PLU-${product._id.slice(-6)}`,
          image: `${API_BASE_URL}${product.image_path}`,
          stock: product.stock_quantity > 0 ? "In stock" : "Out of stock",
        }));

        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.product_type) queryParams.append("product_type", filters.product_type);
        if (filters.Category) queryParams.append("Category", filters.Category);
        if (filters.size) queryParams.append("size", filters.size);
        if (sortOption !== "default") queryParams.append("sort", sortOption);

        const response = await axios.get(`${API_BASE_URL}/api/product/filtered?${queryParams.toString()}`);

        const productsData = response.data.map((product) => ({
          ...product,
          id: product._id,
          name: product.Product_name,
          price: product.price,
          plu: `PLU-${product._id.slice(-6)}`,
          image: `${API_BASE_URL}${product.image_path}`,
          stock: product.stock_quantity > 0 ? "In stock" : "Out of stock",
        }));

        setProducts(productsData);
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
        <Header />
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-btn">Retry</button>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header />
      <section className="shop-section">
        <h1>Shop</h1>
        <div className="shop-controls">
          <p>Showing {products.length} of {products.length} results</p>
          <div className="filters">
            <select name="product_type" value={filters.product_type} onChange={handleFilterChange} className="filter-dropdown">
              <option value="">All Product Types</option>
              <option value="Mattress">Mattress</option>
              <option value="Pillow">Pillow</option>
              <option value="Bedding Accessory">Bedding Accessory</option>
            </select>
            <select name="Category" value={filters.Category} onChange={handleFilterChange} className="filter-dropdown">
              <option value="">All Categories</option>
              <option value="Luxury">Luxury</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Budget-Friendly">Budget-Friendly</option>
            </select>
            <select name="size" value={filters.size} onChange={handleFilterChange} className="filter-dropdown">
              <option value="">All Sizes</option>
              <option value="Twin">Twin</option>
              <option value="Full">Full</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="Standard">Standard</option>
              
            </select>
            <select value={sortOption} onChange={handleSortChange} className="sort-dropdown">
              <option value="default">Default sorting</option>
              <option value="price-low">Sort by price: low to high</option>
              <option value="price-high">Sort by price: high to low</option>
            </select>
          </div>
        </div>
        <div className="product-grid">
          {loading ? (
            Array(4)
              .fill()
              .map((_, index) => <ProductSkeleton key={index} />)
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
              />
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Shop;