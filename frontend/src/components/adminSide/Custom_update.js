import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Custom_update.css';

function CustomUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        length: '',
        width: '',
        color: '',
        material: '',
        pillow_type: '',
        pillow_size: '',
        pillow_color: '',
        pillow_quantity: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8000/custom_product/get/${id}`); 
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const data = await response.json();
            setFormData(data.product); 
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/custom_product/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            alert('Product updated successfully!');
            navigate('/orders');
        } catch (err) {
            console.error('Error:', err);
            alert('Error updating product');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'length' || name === 'width' || name === 'pillow_quantity' 
                ? Number(value) 
                : value
        }));
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger m-5">Error: {error}</div>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Update Custom Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Fabric Details</h5>
                    </div>
                    <div className="card-body">
                        <div className="columns">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Length (meters)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="length"
                                    value={formData.length}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Width (meters)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Color</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Material</label>
                                <select
                                    className="form-select"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Material</option>
                                    <option value="cotton">Cotton</option>
                                    <option value="polyester">Polyester</option>
                                    <option value="silk">Silk</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Pillow Details</h5>
                    </div>
                    <div className="card-body">
                        <div className="columns">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Pillow Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="pillow_type"
                                    value={formData.pillow_type}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Pillow Size</label>
                                <select
                                    className="form-select"
                                    name="pillow_size"
                                    value={formData.pillow_size}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Size</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Pillow Color</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="pillow_color"
                                    value={formData.pillow_color}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="pillow_quantity"
                                    value={formData.pillow_quantity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                        Update Product
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary d-grid gap-2"
                        onClick={() => navigate('/orders')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CustomUpdate;