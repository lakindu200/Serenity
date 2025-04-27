import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:4000/api';

function OrderDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            navigate('/custom/orders');
        }
    }, [id, navigate]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/custom_product/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete order');
            }

            alert('Order deleted successfully');
            navigate('/custom/orders');
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
                    <h3 className="mb-0">Delete Order</h3>
                    <small>Location: Custom Orders / Delete</small>
                </div>
                <div className="card-body">
                    <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Warning: This action cannot be undone!
                    </div>
                    
                    <p className="mb-3">
                        Are you sure you want to delete this order? This will permanently remove
                        the order and all associated data.
                    </p>

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
                                    Delete Order
                                </>
                            )}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/custom/orders')}
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

export default OrderDelete;