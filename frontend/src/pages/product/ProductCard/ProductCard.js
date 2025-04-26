import { assets } from "../../../assets/assets";
import "./ProductCard.css";

function ProductCard({ product, navigate }) {
  return (
    <div className="product-card">
      <img src={product.image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = assets.noImage;
        }}
        alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>Rs.{product.price.toLocaleString()}.00</p>
      <p>PLU: {product.plu}</p>
      <button
        className="read-more-btn"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        Read More
      </button>
    </div>
  );
}

export default ProductCard;