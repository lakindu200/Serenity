import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Custom_payment.css';

// Add API base URL constant at the top
const API_BASE_URL = 'http://localhost:4000/api';

function CustomPayment() {
    const navigate = useNavigate();
    const [priceData, setPriceData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [paymentError, setPaymentError] = useState('');

    useEffect(() => {
        // Get stored data
        const savedPrices = JSON.parse(localStorage.getItem('priceData'));
        const productData = JSON.parse(localStorage.getItem('tempProductData'));
        const clientInfo = JSON.parse(localStorage.getItem('tempClientData'));

        if (!savedPrices || !productData || !clientInfo) {
            alert("Missing required details. Please start over.");
            navigate('/custom/customize');
            return;
        }

        setPriceData(savedPrices);
        setOrderData(productData);
        setClientData(clientInfo);
    }, [navigate]);

    const handleSubmitOrder = async () => {
        if (!paymentAmount) {
            setError('Please enter payment amount');
            return;
        }

        setLoading(true);
        try {
            const orderPayload = {
                length: Math.abs(Number(orderData.length)),
                width: Math.abs(Number(orderData.width)),
                color: orderData.color,
                material: orderData.material,
                pillow_type: orderData.pillow_type,
                pillow_size: orderData.pillow_size,
                pillow_color: orderData.pillow_color,
                pillow_quantity: Math.abs(Number(orderData.pillow_quantity)),
                clientName: clientData.name,
                clientEmail: clientData.email,
                clientPhone: clientData.phone,
                clientAddress: clientData.address,
                subtotal: Math.abs(Number(priceData.subTotal)),
                paymentAmount: Math.abs(parseFloat(paymentAmount)),
                balance: calculateBalance(paymentAmount)
            };

            console.log('Sending order payload:', orderPayload);

            const response = await fetch(`${API_BASE_URL}/custom_product/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(orderPayload)
            });

            // Check response status first
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Failed to parse error response'
                }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Try to parse JSON response
            const result = await response.json().catch(() => {
                throw new Error('Invalid JSON response from server');
            });

            console.log('Order created:', result);

            // Clear storage and navigate only if we get here
            localStorage.removeItem('tempProductData');
            localStorage.removeItem('tempClientData');
            localStorage.removeItem('priceData');

            alert('Order placed successfully!');
            navigate('/custom/orders');

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const calculateBalance = (amount) => {
        const paid = parseFloat(amount) || 0;
        const total = priceData?.subTotal || 0;
        return total - paid;
    };

    const handlePaymentChange = (e) => {
        const amount = e.target.value;
        setPaymentAmount(amount);
        const newBalance = calculateBalance(amount);
        setBalance(newBalance);
        
        const paid = parseFloat(amount) || 0;
        const total = priceData?.subTotal || 0;
        
        if (paid < total) {
            setPaymentError('Payment amount must be at least equal to the total amount');
        } else {
            setPaymentError('');
        }
    };

    return (
        <div className="container mt-5">
            {error && (
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}
            
            {/* Order Summary Card */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Order Calculation</h3>
                </div>
                <div className="card-body">
                    {/* Fabric Cost Section */}
                    <div className="mb-4">
                        <h5 className="mb-3">Fabric Cost Breakdown</h5>
                        <ul className="list-unstyled">
                            <li><strong>Material Type:</strong> {orderData?.material}</li>
                            <li><strong>Dimensions:</strong> {orderData?.length}m × {orderData?.width}m</li>
                            <li><strong>Price per 10cm×10cm:</strong> Rs. {priceData?.materialPrice}</li>
                            <li><strong>Total Area Cost:</strong> Rs. {priceData?.materialTotal?.toFixed(2)}</li>
                        </ul>
                    </div>
                    
                    {/* Pillow Cost Section */}
                    <div className="mb-4">
                        <h5 className="mb-3">Pillow Cost Breakdown</h5>
                        <ul className="list-unstyled">
                            <li><strong>Pillow Type:</strong> {orderData?.pillow_type}</li>
                            <li><strong>Size:</strong> {orderData?.pillow_size}</li>
                            <li><strong>Quantity:</strong> {orderData?.pillow_quantity}</li>
                            <li><strong>Base Price:</strong> Rs. {priceData?.pillowTypePrice}</li>
                            <li><strong>Size Price:</strong> Rs. {priceData?.pillowSizePrice}</li>
                            <li><strong>Total Pillow Cost:</strong> Rs. {priceData?.pillowTotal?.toFixed(2)}</li>
                        </ul>
                    </div>

                    <div className="text-end border-top pt-3">
                        <h4>Sub Total: Rs. {priceData?.subTotal?.toFixed(2)}</h4>
                    </div>
                </div>
            </div>

            {/* Payment Input Card */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Payment Details</h3>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="paymentAmount" className="form-label">
                            Enter Payment Amount (Rs.)
                        </label>
                        <input
                            type="number"
                            className={`form-control ${paymentError ? 'is-invalid' : ''}`}
                            id="paymentAmount"
                            value={paymentAmount}
                            onChange={handlePaymentChange}
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                            required
                        />
                        {paymentError && (
                            <div className="invalid-feedback">
                                {paymentError}
                            </div>
                        )}
                        <small className="text-muted">
                            Minimum payment amount: Rs. {priceData?.subTotal?.toFixed(2)}
                        </small>
                    </div>
                </div>
            </div>

            {/* Payment Summary Section */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Payment Summary</h3>
                </div>
                <div className="card-body">
                    <div className="summary-item d-flex justify-content-between mb-3">
                        <span>Total Amount:</span>
                        <strong>Rs. {priceData?.subTotal?.toFixed(2)}</strong>
                    </div>
                    <div className="summary-item d-flex justify-content-between mb-3">
                        <span>Payment Amount:</span>
                        <strong>Rs. {parseFloat(paymentAmount || 0).toFixed(2)}</strong>
                    </div>
                    <div className="summary-item d-flex justify-content-between">
                        <span>Balance:</span>
                        <strong className={balance < 0 ? 'text-success' : 'text-danger'}>
                            Rs. {Math.abs(balance).toFixed(2)}
                            {balance < 0 ? ' (Change)' : ''}
                        </strong>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="btn-card">
                <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/custom/add-price')}
                    disabled={loading}
                >
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmitOrder}
                    disabled={loading || !paymentAmount || paymentError}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm"></span>
                            Processing...
                        </>
                    ) : (
                        <>Place Order <i className="bi bi-check2-circle"></i></>
                    )}
                </button>
            </div>
        </div>
    );
}

export default CustomPayment;