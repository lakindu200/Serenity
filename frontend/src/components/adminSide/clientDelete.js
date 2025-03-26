import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ClientDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            navigate('/client');
        }
    }, [id, navigate]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/client_details/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete client');
            }

            alert('Client deleted successfully');
            navigate('/client');
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                    <h3 className="mb-0">Delete Client</h3>
                </div>
                <div className="card-body">
                    <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Warning: This action cannot be undone!
                    </div>
                    
                    <p className="mb-3">
                        Are you sure you want to delete this client?
                    </p>

                    {error && (
                        <div className="alert alert-danger mt-3">
                            <i className="bi bi-x-circle me-2"></i>
                            {error}
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            className="btn btn-danger me-2"
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
                            onClick={() => navigate('/client')}
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