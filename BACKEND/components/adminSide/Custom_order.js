import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Custom_order.css';

const API_BASE_URL = 'http://localhost:4000/api';

function CustomOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/custom_product`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            console.log('Fetched orders:', data);
            setOrders(data.products || []);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders based on search
    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        
        if (searchBy === 'name') {
            return order.client.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        if (searchBy === 'orderId') {
            return order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        return false;
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Custom Orders</h2>
                <div className="search-section">
                    <select 
                        className="form-select me-2"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="name">Search by Client Name</option>
                        <option value="orderId">Search by Order ID</option>
                    </select>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={`Search by ${searchBy}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row">
                {filteredOrders.map(order => (
                    <div key={order._id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Order #{order.orderNumber}</h5>
                                <small>{new Date(order.orderDate).toLocaleDateString()}</small>
                            </div>
                            <div className="card-body">
                                <h6 className="text-primary mb-3">Client Details</h6>
                                <ul className="list-unstyled mb-4">
                                    <li><strong>Name:</strong> {order.client.name}</li>
                                    <li><strong>Email:</strong> {order.client.email}</li>
                                    <li><strong>Phone:</strong> {order.client.phone}</li>
                                </ul>

                                <h6 className="text-primary mb-3">Product Details</h6>
                                <ul className="list-unstyled mb-4">
                                    <li><strong>Material:</strong> {order.productDetails.material}</li>
                                    <li><strong>Dimensions:</strong> {order.productDetails.length}x{order.productDetails.width}</li>
                                    <li><strong>Color:</strong> {order.productDetails.color}</li>
                                </ul>

                                <h6 className="text-primary mb-3">Payment Details</h6>
                                <ul className="list-unstyled mb-4">
                                    <li><strong>Total:</strong> Rs. {order.payment.subtotal}</li>
                                    <li><strong>Paid:</strong> Rs. {order.payment.paymentAmount}</li>
                                    <li><strong>Balance:</strong> Rs. {order.payment.balance}</li>
                                </ul>

                                <div className="mt-3">
                                    <span className={`badge ${order.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && filteredOrders.length === 0 && (
                <div className="alert alert-info">
                    No orders found.
                </div>
            )}
        </div>
    );
}

export default CustomOrder;