import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Client_order.css';

function ClientOrder() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/client_details/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }

            const data = await response.json();
            setClients(data.clients || []);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

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
                <h4>Error Loading Clients</h4>
                <p>{error}</p>
                <button 
                    className="btn btn-outline-danger"
                    onClick={fetchClients}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Client List</h2>
            <div className="row">
                {clients.map(client => (
                    <div key={client._id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Client Details</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li><strong>Name:</strong> {client.name}</li>
                                    <li><strong>Email:</strong> {client.email}</li>
                                    <li><strong>Phone:</strong> {client.phone}</li>
                                    <li><strong>Address:</strong> {client.address}</li>
                                </ul>
                                <div className="mt-3">
                                    <Link 
                                        to={`/client-delete/${client._id}`} 
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete Client
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientOrder;