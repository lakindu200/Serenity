import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Client_order.css';

const API_BASE_URL = 'http://localhost:4000/api';

function ClientOrder() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/client_details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
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

    const handleDelete = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/client_details/delete/${clientId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete client');
                }

                // Remove the deleted client from the state
                setClients(prevClients => prevClients.filter(client => client._id !== clientId));
                alert('Client deleted successfully');
            } catch (err) {
                console.error('Error:', err);
                alert(err.message);
            }
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Client List</h2>
                <button 
                    className="btn btn-primary"
                    onClick={fetchClients}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                </button>
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
                {clients.map(client => (
                    <div key={client._id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">{client.name}</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li><strong>Email:</strong> {client.email}</li>
                                    <li><strong>Phone:</strong> {client.phone}</li>
                                    <li><strong>Address:</strong> {client.address}</li>
                                </ul>
                            </div>
                            <div className="card-footer">
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(client._id)}
                                >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && clients.length === 0 && (
                <div className="alert alert-info">
                    No clients found.
                </div>
            )}
        </div>
    );
}

export default ClientOrder;