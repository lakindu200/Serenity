import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './CartView.css';

const API_BASE_URL = 'http://localhost:4000'; // Add base URL constant

const CartView = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Colombo');
  const [receiptFile, setReceiptFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart/getAll`);
      setCartItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error loading cart items. Please try again.');
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    // Address validation
    if (!address.trim()) {
      errors.address = 'Please enter your address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity <= 0) return;
    try {
      const response = await axios.put(`${API_BASE_URL}/api/cart/update/${id}`, {
        quantity: parseInt(newQuantity)
      });
      setCartItems(response.data.items);
    } catch (err) {
      setError('Error updating cart item');
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
        // Add confirmation dialog
        if (!window.confirm('Are you sure you want to remove this item from cart?')) {
            return;
        }

        console.log('Deleting cart item with ID:', id);

        const response = await axios.delete(`${API_BASE_URL}/api/cart/delete/${id}`);
        
        if (response.data.success) {
            setCartItems(response.data.items);
            setError(null); // Clear any existing errors
        } else {
            throw new Error(response.data.message || 'Failed to delete item');
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error deleting cart item';
        setError(errorMessage);
        console.error('Delete error:', err);
    }
};

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = deliveryLocation === 'Outside Colombo' ? 5000 : 0;
  const totalCost = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!receiptFile) {
      setFormErrors({ receipt: 'Please upload a bank receipt' });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('deliveryLocation', deliveryLocation);
      formData.append('subtotal', subtotal);
      formData.append('deliveryFee', deliveryFee);
      formData.append('totalCost', totalCost);
      formData.append('products', JSON.stringify(cartItems));
      formData.append('receipt', receiptFile);

      // Create payment record
      const response = await axios.post(`${API_BASE_URL}/api/payment/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        // Clear cart after successful order
        await axios.delete(`${API_BASE_URL}/api/cart/clear`);
        alert('Order placed successfully!');
        navigate('/shop'); // Redirect to shop instead of payment details
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <FaShoppingCart className="cart-icon" />
        <h1>Your Shopping Cart</h1>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <FaShoppingCart className="empty-cart-icon" />
          <p>Your cart is empty</p>
          <Link to="/shop" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="product-cell">
                      <img src={item.image} alt={item.productName} />
                      <span>{item.productName}</span>
                    </td>
                    <td>Rs.{item.price.toFixed(2)}</td>
                    <td>
                      <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}>-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          min="1"
                        />
                        <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td>Rs.{(item.totalPrice || item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteItem(item._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="checkout-section">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>Rs.{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs.{totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="checkout-form">
          <h2>Customer Information</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={formErrors.phone ? 'error' : ''}
              />
              {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={formErrors.address ? 'error' : ''}
              />
              {formErrors.address && <span className="error-text">{formErrors.address}</span>}
            </div>

            <div className="form-group">
              <select
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
              >
                <option value="Colombo">Colombo</option>
                <option value="Outside Colombo">Outside Colombo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Upload Bank Receipt</label>
              <input
                type="file"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                accept="image/*"
                className={formErrors.receipt ? 'error' : ''}
              />
              {formErrors.receipt && <span className="error-text">{formErrors.receipt}</span>}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>Rs.{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs.{totalCost.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CartView;