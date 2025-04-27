import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateOrderReport } from './Report';
import './Custom_order.css';

const API_BASE_URL = 'http://localhost:4000/api';

function CustomOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('orderId');
    const [sortBy, setSortBy] = useState('latest');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching orders from:', `${API_BASE_URL}/custom_product`);
            
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
            console.log('Raw API response:', data);

            if (!data.success || !Array.isArray(data.products)) {
                throw new Error('Invalid data format received');
            }

            const formattedOrders = data.products.map(order => ({
                _id: order._id,
                orderNumber: order._id.toString().slice(-6).toUpperCase(),
                orderDate: new Date(order.createdAt || order.orderDate).toLocaleDateString(),
                productDetails: {
                    length: order.productDetails.length || 0,
                    width: order.productDetails.width || 0,
                    color: order.productDetails.color || 'N/A',
                    material: order.productDetails.material || 'N/A',
                    pillow: {
                        type: order.productDetails.pillow.type || 'N/A',
                        size: order.productDetails.pillow.size || 'N/A',
                        color: order.productDetails.pillow.color || 'N/A',
                        quantity: order.productDetails.pillow.quantity || 0
                    }
                },
                client: {
                    name: order.client?.name || 'N/A',
                    email: order.client?.email || 'N/A',
                    phone: order.client?.phone || 'N/A',
                    address: order.client?.address || 'N/A'
                },
                payment: {
                    subtotal: Number(order.payment.subtotal) || 0,
                    paymentAmount: Number(order.payment.paymentAmount) || 0,
                    balance: Number(order.payment.balance) || 0
                },
                status: order.status || 'pending'
            }));

            console.log('Formatted orders:', formattedOrders);
            setOrders(formattedOrders);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getFilteredOrders = () => {
        return orders
            .filter(order => {
                if (searchTerm) {
                    if (searchBy === 'orderId') {
                        return order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                    if (searchBy === 'clientName') {
                        return order.client.name.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                }
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'latest':
                        return new Date(b.orderDate) - new Date(a.orderDate);
                    case 'oldest':
                        return new Date(a.orderDate) - new Date(b.orderDate);
                    case 'highest':
                        return b.payment.subtotal - a.payment.subtotal;
                    case 'lowest':
                        return a.payment.subtotal - b.payment.subtotal;
                    default:
                        return 0;
                }
            });
    };

    const filteredOrders = getFilteredOrders();

    const handleGenerateReport = () => {
        try {
            const clientsMap = {};
            orders.forEach(order => {
                if (order.client) {
                    clientsMap[order._id] = {
                        name: order.client.name,
                        email: order.client.email,
                        phone: order.client.phone,
                        address: order.client.address
                    };
                }
            });

            const formattedOrders = orders.map(order => ({
                _id: order._id,
                length: order.productDetails.length,
                width: order.productDetails.width,
                material: order.productDetails.material,
                pillow_type: order.productDetails.pillow.type,
                pillow_quantity: order.productDetails.pillow.quantity,
                subtotal: order.payment.subtotal,
                orderDate: order.orderDate
            }));

            generateOrderReport(formattedOrders, clientsMap);
        } catch (err) {
            console.error('Error generating report:', err);
            alert('Failed to generate report. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Custom Orders</h2>
                <div className="d-flex gap-3">
                    <div className="filters d-flex gap-2">
                        <select 
                            className="form-select"
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                        >
                            <option value="orderId">Search by Order ID</option>
                            <option value="clientName">Search by Client Name</option>
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`Search by ${searchBy}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={handleGenerateReport}
                    >
                        <i className="bi bi-file-earmark-pdf me-2"></i>
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="order-summary mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <h6>Total Orders</h6>
                                <h3>{orders.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <h6>Total Revenue</h6>
                                <h3>Rs. {orders.reduce((sum, order) => sum + order.payment.subtotal, 0).toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
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
                    <h4>Error Loading Data</h4>
                    <p>{error}</p>
                    <button 
                        className="btn btn-outline-danger"
                        onClick={fetchOrders}
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="row">
                {filteredOrders.map(order => (
                    <div key={order._id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Order #{order.orderNumber}</h5>
                                <small>{order.orderDate}</small>
                            </div>
                            <div className="card-body">
                                <h6 className="text-primary mb-3">Client Details</h6>
                                <ul className="list-unstyled mb-4">
                                    <li><strong>Name:</strong> {order.client?.name || 'N/A'}</li>
                                    <li><strong>Email:</strong> {order.client?.email || 'N/A'}</li>
                                    <li><strong>Phone:</strong> {order.client?.phone || 'N/A'}</li>
                                    <li><strong>Address:</strong> {order.client?.address || 'N/A'}</li>
                                </ul>

                                <h6 className="text-primary mb-3">Product Details</h6>
                                <ul className="list-unstyled mb-4">
                                    <li><strong>Material:</strong> {order.productDetails.material}</li>
                                    <li><strong>Dimensions:</strong> {order.productDetails.length}x{order.productDetails.width}</li>
                                    <li><strong>Color:</strong> {order.productDetails.color}</li>
                                    <li><strong>Pillow Type:</strong> {order.productDetails.pillow.type}</li>
                                    <li><strong>Pillow Size:</strong> {order.productDetails.pillow.size}</li>
                                    <li><strong>Pillow Color:</strong> {order.productDetails.pillow.color}</li>
                                    <li><strong>Pillow Quantity:</strong> {order.productDetails.pillow.quantity}</li>
                                </ul>

                                <h6 className="text-primary mb-3">Payment Details</h6>
                                <ul className="list-unstyled mb-4">
                                    <li><strong>Total:</strong> Rs. {order.payment.subtotal.toFixed(2)}</li>
                                    <li><strong>Paid:</strong> Rs. {order.payment.paymentAmount.toFixed(2)}</li>
                                    <li><strong>Balance:</strong> Rs. {order.payment.balance.toFixed(2)}</li>
                                </ul>
                            </div>
                            <div className="card-footer">
                                <Link 
                                    to={`/custom/update/${order._id}`}
                                    className="btn btn-primary btn-sm me-2"
                                >
                                    <i className="bi bi-pencil me-1"></i>
                                    Edit
                                </Link>
                                <Link 
                                    to={`/custom/delete/${order._id}`}
                                    className="btn btn-danger btn-sm"
                                >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                </Link>
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