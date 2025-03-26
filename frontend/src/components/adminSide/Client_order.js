import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function ClientOrder() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:8000/client_details/');
            if (!response.ok) {
                throw new Error('Failed to fetch client data');
            }
            const data = await response.json();
            
            // Check if data has the expected structure
            if (!data.clients || !Array.isArray(data.clients)) {
                throw new Error('Invalid data format received');
            }
            
            setClients(data.clients);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading clients...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-5">
                <h4 className="alert-heading">Error!</h4>
                <p>{error}</p>
                <hr />
                <button 
                    className="btn btn-outline-danger"
                    onClick={fetchClients}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-5">Client Orders</h2>
            {clients.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    No clients found.
                </div>
            ) : (
                <div className="row">
                    {clients.map((client) => (
                        <div key={client._id} className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-2">Client Information</h5>
                                    <small>Order ID: {client._id}</small>
                                </div>
                                <div className="card-body">
                                    <ul className="list-unstyled">
                                        <li className="mb-4">
                                            <strong>Name: </strong>
                                            {client.name}
                                        </li>
                                        <li className="mb-4">
                                            <strong>Email: </strong>
                                            {client.email}
                                        </li>
                                        <li className="mb-4">
                                            <strong>Phone: </strong>
                                            {client.phone}
                                        </li>
                                        <li className="mb-4">
                                            <strong>Address: </strong>
                                            {client.address}
                                        </li>
                                    </ul>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Link 
                                            to={`/orders?id=${client._id}`} 
                                            className="btn btn-primary btn-sm"
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                            View Order Details
                                        </Link>
                                        <Link 
                                            to={`/client-delete/${client._id}`}
                                            className="btn btn-danger btn-sm"
                                        >
                                            <i className="bi bi-trash me-1"></i>
                                            Delete
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ClientOrder;