import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:4000/api';

function ClientDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientData, setClientData] = useState(null);

    useEffect(() => {
        if (!id) {
            navigate('/custom/clients');
            return;
        }
        fetchClientDetails();
    }, [id, navigate]);

    const fetchClientDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/client_details/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch client details');
            }
            const data = await response.json();
            if (!data.success || !data.client) {
                throw new Error('Client not found');
            }
            setClientData(data.client);
        } catch (err) {
            console.error('Error fetching client:', err);
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this client?')) {
            return;
        }

        setLoading(true);
        try {
            console.log('Sending delete request for client:', id);
            
            const response = await fetch(`${API_BASE_URL}/client_details/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete client');
            }

            if (!data.success) {
                throw new Error(data.message || 'Failed to delete client');
            }

            alert('Client deleted successfully');
            navigate('/custom/clients');
        } catch (err) {
            console.error('Error deleting client:', err);
            setError(err.message || 'Failed to delete client');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                    <h3 className="mb-0">Delete Client</h3>
                    <small>Location: Clients / Delete</small>
                </div>
                <div className="card-body">
                    <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Warning: This action cannot be undone!
                    </div>
                    
                    {clientData && (
                        <div className="mb-4">
                            <h5>Client Details:</h5>
                            <ul className="list-unstyled">
                                <li><strong>Name:</strong> {clientData.name}</li>
                                <li><strong>Email:</strong> {clientData.email}</li>
                                <li><strong>Phone:</strong> {clientData.phone}</li>
                                <li><strong>Address:</strong> {clientData.address}</li>
                            </ul>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger mt-3">
                            <i className="bi bi-x-circle me-2"></i>
                            {error}
                        </div>
                    )}

                    <div className="mt-4 d-flex gap-2">
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-trash me-2"></i>
                                    Delete Client
                                </>
                            )}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/custom/clients')}
                            disabled={loading}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClientDelete;