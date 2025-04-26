import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomClientDetails() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            alert('Please fill in all fields');
            return;
        }

        const productData = JSON.parse(localStorage.getItem('tempProductData'));
        if (!productData) {
            alert('Product details not found. Please start over.');
            navigate('/customize');
            return;
        }

        
            localStorage.setItem('tempClientData', JSON.stringify(formData));
            navigate('/payment');
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Client Details</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <small className="text-muted">Enter your full name as it should appear on the order.</small>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <small className="text-muted">We'll send order confirmations to this email.</small>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <small className="text-muted">Enter a valid contact number.</small>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Delivery Address</label>
                            <textarea
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                required
                            ></textarea>
                            <small className="text-muted">Provide your complete delivery address.</small>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/customize')}
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to Product Details
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Proceed to Payment
                                <i className="bi bi-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CustomClientDetails;