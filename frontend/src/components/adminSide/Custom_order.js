import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { generateOrderReport } from './Report';
import './Custom_order.css';

function CustomOrder() {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // 'name' or 'orderId'

    // Format date helper function
    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        
        try {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', options);
        } catch (err) {
            console.error('Date formatting error:', err);
            return 'Date format error';
        }
    };

    const fetchOrdersAndClients = async () => {
        try {
            // Fetch orders
            const orderResponse = await fetch('http://localhost:8000/custom_product/');
            if (!orderResponse.ok) {
                throw new Error('Failed to fetch orders');
            }
            const orderData = await orderResponse.json();
            
            
            if (!orderData.products || !Array.isArray(orderData.products)) {
                throw new Error('Invalid order data format');
            }

            // Fetch clients
            const clientResponse = await fetch('http://localhost:8000/client_details/');
            if (!clientResponse.ok) {
                throw new Error('Failed to fetch clients');
            }
            const clientData = await clientResponse.json();
            
            
            if (!clientData.clients || !Array.isArray(clientData.clients)) {
                throw new Error('Invalid client data format');
            }

            // Create a map
            const clientMap = {};
            clientData.clients.forEach(client => {
                clientMap[client._id.toString()] = client;
            });

            setOrders(orderData.products);
            setClients(clientMap);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersAndClients();
    }, []);

    const handleGenerateReport = () => {
        generateOrderReport(orders, clients);
    };

    const filteredOrders = orders.filter(order => {
        const clientId = order._id.toString();
        const client = clients[clientId];
        
        if (searchTerm === '') return true;
        
        if (searchBy === 'name' && client) {
            return client.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchBy === 'orderId') {
            return order._id.toString().includes(searchTerm);
        }
        return false;
    });

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger m-5">Error: {error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Custom Orders</h2>
                <button 
                    className="btn btn-success"
                    onClick={handleGenerateReport}
                >
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    Generate Report
                </button>
            </div>
            <div className="mb-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="input-group">
                            <select 
                                className="form-select flex-grow-0 w-auto"
                                value={searchBy}
                                onChange={(e) => setSearchBy(e.target.value)}
                            >
                                <option value="name">Search by Client Name</option>
                                <option value="orderId">Search by Order ID</option>
                            </select>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={searchBy === 'name' ? "Enter client name..." : "Enter order ID..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    className="btn btn-outline-secondary"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                {filteredOrders.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            No orders found matching your search criteria.
                        </div>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const clientId = order._id.toString();
                        const client = clients[clientId];
                        
                        return (
                            <div key={order._id} className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">Order ID: {order._id}</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <h6 className="text-primary">Fabric Details:</h6>
                                            <ul className="list-unstyled">
                                                <li><strong>Length:</strong> {order.length} meters</li>
                                                <li><strong>Width:</strong> {order.width} meters</li>
                                                <li><strong>Color:</strong> {order.color}</li>
                                                <li><strong>Material:</strong> {order.material}</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h6 className="text-primary">Pillow Details:</h6>
                                            <ul className="list-unstyled">
                                                <li><strong>Type:</strong> {order.pillow_type}</li>
                                                <li><strong>Size:</strong> {order.pillow_size}</li>
                                                <li><strong>Color:</strong> {order.pillow_color}</li>
                                                <li><strong>Quantity:</strong> {order.pillow_quantity}</li>
                                            </ul>
                                        </div>
                                        
                                        
                                        <div className="mt-3 border-top pt-3">
                                            <h6 className="text-primary">Order Summary</h6>
                                            <ul className="list-unstyled">
                                                <li><strong>Order Date:</strong> {formatDate(order.orderDate)}</li>
                                                <li className="h5 mt-2"><strong>Total Amount:</strong> Rs. {order.subtotal?.toFixed(2)}</li>
                                            </ul>
                                        </div>

                                        
                                        {client && (
                                            <div className="mt-3 border-top pt-3">
                                                <h6 className="text-primary">Client Information</h6>
                                                <ul className="list-unstyled">
                                                    <li><strong>Name:</strong> {client.name}</li>
                                                    <li><strong>Phone:</strong> {client.phone}</li>
                                                    <li><strong>Email:</strong> {client.email}</li>
                                                </ul>
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            <Link to={`/update-product/${order._id}`} className="btn btn-primary btn-sm">
                                                <i className="bi bi-pencil me-1"></i>
                                                Update
                                            </Link>
                                            <Link to={`/Order-delete/${order._id}`} className="btn btn-danger btn-sm ms-2">
                                                <i className="bi bi-trash me-1"></i>
                                                Delete
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default CustomOrder;