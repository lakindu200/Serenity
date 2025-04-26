import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { FaTrash, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import './CartView.css';

const CartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Colombo');
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/cart/getAll');
        setCartItems(response.data);
      } catch (err) {
        setError('Error fetching cart items');
        console.error(err);
      }
    };

    fetchCartItems();
  }, []);

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
      const response = await axios.put(`http://localhost:4000/api/cart/update/${id}`, {
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

        const response = await axios.delete(`http://localhost:4000/api/cart/delete/${id}`);
        
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

  // Calculate total cost
  const subtotal = cartItems.reduce((total, item) => total + (item.totalPrice || item.price * item.quantity), 0);
  const deliveryFee = deliveryLocation === 'Outside Colombo' ? 5000 : 0;
  const totalCost = subtotal + deliveryFee;

  // Handle checkout process
  const handleCheckout = () => {
    const isValid = validateForm();
    if (!isValid) return;

    setShowReceiptUpload(true);
  };

  // Handle receipt upload
  const handleReceiptUpload = async () => {
    if (!receiptFile) {
        alert('Please upload a bank receipt.');
        return;
    }

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

    try {
        const response = await axios.post('http://localhost:4000/api/payment/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.success) {
            // Clear cart after successful order
            await axios.delete('http://localhost:4000/api/cart/clear');
            setCartItems([]);
            setShowReceiptUpload(false);
            alert('Order completed successfully!');
        } else {
            throw new Error(response.data.message);
        }
    } catch (err) {
        console.error('Error completing order:', err);
        alert('Error completing order: ' + (err.response?.data?.message || err.message));
    }
};

  return (
    <>
      <Header />
      <div className="cart-container">
        <div className="cart-header">
          <FaShoppingCart className="cart-icon" />
          <h1>Your Shopping Cart</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <p>Your cart is empty</p>
            <button onClick={() => window.location.href='/shop'} className="continue-shopping">
              Continue Shopping
            </button>
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

              <div className="customer-details">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={formErrors.phone ? 'error' : ''}
                />
                {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}

                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={formErrors.address ? 'error' : ''}
                />
                {formErrors.address && <span className="error-text">{formErrors.address}</span>}

                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Outside Colombo">Outside Colombo</option>
                </select>
              </div>

              {!showReceiptUpload ? (
                <button className="checkout-btn" onClick={handleCheckout}>
                  <FaCreditCard /> Proceed to Payment
                </button>
              ) : (
                <div className="receipt-upload">
                  <h3>Upload Bank Receipt</h3>
                  <input
                    type="file"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    accept="image/*"
                  />
                  <button className="complete-order-btn" onClick={handleReceiptUpload}>
                    Complete Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartView;