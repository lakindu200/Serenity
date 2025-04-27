import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Add_client_details.css';


function AddClientDetail() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const validatePhone = (value) => {
        const cleanedNumber = value.replace(/\D/g, '');
        
        if (cleanedNumber.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits');
            return false;
        }
        setPhoneError('');
        return true;
    };
    
    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };


    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const numberValue = value.replace(/\D/g, '');
        setPhone(numberValue);
        validatePhone(numberValue);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePhone(phone) || !validateEmail(email)) {
            return; 
        }

        const productData = JSON.parse(localStorage.getItem('tempProductData'));
        
        if (!productData) {
            alert("No product data found. Please add product first.");
            navigate('/custom/customize');
            return;
        }

        const clientData = {
            name,
            email,
            phone,
            address
        };

        try {
            localStorage.setItem('tempClientData', JSON.stringify(clientData));
            navigate('/custom/add-price');
        } catch (err) {
            console.error('Error saving client data:', err);
            alert('Error saving client details. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="client_add">Add Client Details</div>
            <form className="fromInputs" onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        placeholder="Enter name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                        id="email" 
                        placeholder="Enter email" 
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    {emailError && (
                        <div className="invalid-feedback">
                            {emailError}
                        </div>
                    )}
                    <small className="text-muted">
                        Enter a valid email address (e.g., example@domain.com)
                    </small>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                        type="text"
                        className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                        id="phone"
                        placeholder="Enter 10-digit phone number"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength="10"
                        required
                    />
                    {phoneError && (
                        <div className="invalid-feedback">
                            {phoneError}
                        </div>
                    )}
                    <small className="text-muted">
                        Please enter a 10-digit phone number without spaces or special characters
                    </small>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="address">Address</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Proceed</button>
            </form>
        </div>
    );
}

export default AddClientDetail;




