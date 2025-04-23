import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        const response = await axios.get('http://localhost:8020/cart/getAll');
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
      const response = await axios.put(`http://localhost:8020/cart/update/${id}`, {
        quantity: newQuantity,
      });
      setCartItems(response.data.items);
    } catch (err) {
      setError('Error updating cart item');
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8020/cart/delete/${id}`);
      setCartItems(response.data.items);
    } catch (err) {
      setError('Error deleting cart item');
      console.error(err);
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
      const response = await axios.post('http://localhost:8020/checkout/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Order completed successfully!');
      setCartItems([]); // Clear the cart
      setShowReceiptUpload(false); // Hide the receipt upload section
    } catch (err) {
      console.error('Error completing order:', err);
      alert('Error completing order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Table */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Cart Items</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Total Price</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2">Rs.{item.price.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                        min="1"
                        className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">Rs.{(item.totalPrice || item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Details and Checkout Section */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
              </div>
              <select
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Colombo">Colombo</option>
                <option value="Outside Colombo">Outside Colombo</option>
              </select>
            </div>

            {/* Total Cost */}
            <div className="mt-6">
              <h3 className="text-lg font-bold">Total Cost</h3>
              <p>Subtotal: Rs.{subtotal.toFixed(2)}</p>
              <p>Delivery Fee: Rs.{deliveryFee.toFixed(2)}</p>
              <p className="font-bold">Total: Rs.{totalCost.toFixed(2)}</p>
            </div>

            {/* Process to Checkout Button */}
            {!showReceiptUpload && (
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors"
              >
                Process to Checkout
              </button>
            )}

            {/* Bank Receipt Upload Section */}
            {showReceiptUpload && (
              <div className="mt-6">
                <h3 className="text-lg font-bold">Upload Bank Receipt</h3>
                <input
                  type="file"
                  onChange={(e) => setReceiptFile(e.target.files[0])}
                  className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleReceiptUpload}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition-colors"
                >
                  Complete Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;