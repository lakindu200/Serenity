import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Custom_update.css';

const API_BASE_URL = 'http://localhost:4000/api';

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
            console.log('Fetching product details for ID:', id);
            const response = await fetch(`${API_BASE_URL}/custom_product/get/${id}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch product details');
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (!data.product) {
                throw new Error('No product data received');
            }

            // Extract product details from the formatted response
            const productDetails = {
                length: data.product.productDetails.length,
                width: data.product.productDetails.width,
                color: data.product.productDetails.color,
                material: data.product.productDetails.material,
                pillow_type: data.product.productDetails.pillow.type,
                pillow_size: data.product.productDetails.pillow.size,
                pillow_color: data.product.productDetails.pillow.color,
                pillow_quantity: data.product.productDetails.pillow.quantity
            };

            setFormData(productDetails);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.length || formData.length <= 0) errors.length = 'Length must be greater than 0';
        if (!formData.width || formData.width <= 0) errors.width = 'Width must be greater than 0';
        if (!formData.color?.trim()) errors.color = 'Color is required';
        if (!formData.material) errors.material = 'Material is required';
        if (!formData.pillow_type) errors.pillow_type = 'Pillow type is required';
        if (!formData.pillow_size) errors.pillow_size = 'Pillow size is required';
        if (!formData.pillow_color?.trim()) errors.pillow_color = 'Pillow color is required';
        if (!formData.pillow_quantity || formData.pillow_quantity < 1) {
            errors.pillow_quantity = 'Quantity must be at least 1';
        }

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fill in all required fields correctly');
            return;
        }

        try {
            const updatedProduct = {
                length: Number(formData.length),
                width: Number(formData.width),
                color: formData.color.trim(),
                material: formData.material,
                pillow_type: formData.pillow_type,
                pillow_size: formData.pillow_size,
                pillow_color: formData.pillow_color.trim(),
                pillow_quantity: Number(formData.pillow_quantity)
            };

            console.log('Sending update:', updatedProduct);

            const response = await fetch(`${API_BASE_URL}/custom_product/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            const result = await response.json();
            console.log('Update successful:', result);

            alert('Product updated successfully!');
            navigate('/custom/orders');
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err.message);
            alert(`Error updating product: ${err.message}`);
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
                                    <option value="Innerspring Mattress">Innerspring Mattress</option>
                                    <option value="Memory Foam Mattress">Memory Foam Mattress</option>
                                    <option value="Hybrid Mattress">Hybrid Mattress</option>
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
                                <select
                                    className="form-select"
                                    name="pillow_type"
                                    value={formData.pillow_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="decorative">Decorative</option>
                                    <option value="sleeping">Sleeping</option>
                                    <option value="orthopedic">Orthopedic</option>
                                </select>
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

                <div className="btn-card">
                    <button type="submit" className="btn btn-primary">
                        Update Product
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/custom/orders')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CustomUpdate;