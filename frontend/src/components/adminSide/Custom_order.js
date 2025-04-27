import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Custom_order.css';

function CustomOrder() {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name');

    const fetchOrdersAndClients = async () => {
        try {
            setLoading(true);
            // Fetch orders
            const orderResponse = await fetch('http://localhost:8000/custom_product/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orderData = await orderResponse.json();
            
            // Fetch clients
            const clientResponse = await fetch('http://localhost:8000/client_details/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!clientResponse.ok) {
                throw new Error('Failed to fetch clients');
            }

            const clientData = await clientResponse.json();

            // Create a map of clients by ID
            const clientMap = {};
            if (clientData.clients) {
                clientData.clients.forEach(client => {
                    clientMap[client._id] = client;
                });
            }

            setOrders(orderData.products || []);
            setClients(clientMap);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersAndClients();
    }, []);

    // Filter orders based on search
    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        
        const client = clients[order._id];
        
        if (searchBy === 'name' && client) {
            return client.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        if (searchBy === 'orderId') {
            return order._id.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        return false;
    });

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4">
                <h4>Error Loading Data</h4>
                <p>{error}</p>
                <button 
                    className="btn btn-outline-danger"
                    onClick={fetchOrdersAndClients}
                >
                    Retry
                </button>
            </div>
        );
    }

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

            <div className="row">
                {filteredOrders.map(order => {
                    const client = clients[order._id];
                    return (
                        <div key={order._id} className="col-md-6 mb-4">
                            <div className="card">
                                {/* ... rest of your order display code ... */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CustomOrder;