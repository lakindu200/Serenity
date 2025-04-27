import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Add_client_details.css';

function AddClientDetail() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        try {
            // Get product data from localStorage
            const productData = JSON.parse(localStorage.getItem('tempProductData'));
            if (!productData) {
                toast.error('No product data found. Please add product first.');
                navigate('/custom/customize');
                return;
            }

            // Save client data to database
            const response = await fetch('http://localhost:4000/api/client_details/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim()
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to save client details');
            }

            // Save combined data to localStorage for next step
            localStorage.setItem('tempClientData', JSON.stringify({
                ...formData,
                clientId: data.client._id // Store the client ID from database response
            }));
            
            toast.success('Client details saved successfully');
            navigate('/custom/add-price');
        } catch (err) {
            console.error('Error saving client data:', err);
            toast.error(err.message || 'Error saving client details. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="client_add">Add Client Details</div>
            <form className="fromInputs" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="form-group mb-3">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email Field */}
                <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Phone Field */}
                <div className="form-group mb-3">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        name="phone"
                        placeholder="Enter 10-digit phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="10"
                        required
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                {/* Address Field */}
                <div className="form-group mb-3">
                    <label htmlFor="address">Address</label>
                    <textarea
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        id="address"
                        name="address"
                        placeholder="Enter complete address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                    Proceed to Pricing
                </button>
            </form>
            
            <ToastContainer />
        </div>
    );
}

export default AddClientDetail;




