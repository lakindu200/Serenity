import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomPayment() {
    const navigate = useNavigate();
    const [priceData, setPriceData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get stored data
        const savedPrices = JSON.parse(localStorage.getItem('priceData'));
        const productData = JSON.parse(localStorage.getItem('tempProductData'));
        const clientInfo = JSON.parse(localStorage.getItem('tempClientData'));

        if (!savedPrices || !productData || !clientInfo) {
            alert("Missing order, price, or client details");
            navigate('/add-price');
            return;
        }

        setPriceData(savedPrices);
        setOrderData(productData);
        setClientData(clientInfo);
    }, [navigate]);

    const handleSubmitOrder = async () => {
        setLoading(true);
        try {
            const productPayload = {
                ...orderData,
                orderDate: new Date(),
                subtotal: priceData.subTotal
            };

            
            const productResponse = await fetch('http://localhost:8000/custom_product/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productPayload)
            });

            if (!productResponse.ok) {
                throw new Error('Failed to save product');
            }

            const productResult = await productResponse.json();
            
            if (!productResult.product || !productResult.product._id) {
                throw new Error('Invalid product response');
            }

            
            const clientResponse = await fetch('http://localhost:8000/client_details/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: productResult.product._id,
                    ...clientData
                })
            });

            if (!clientResponse.ok) {
                throw new Error('Failed to save client details');
            }

            // Clear localStorage
            localStorage.removeItem('tempProductData');
            localStorage.removeItem('tempClientData');
            localStorage.removeItem('priceData');

            alert('Order placed successfully!');
            navigate('/');
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Order Summary</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="mb-3">Fabric Cost Breakdown</h5>
                            <ul className="list-unstyled">
                                <li><strong>Material Type:</strong> {orderData?.material}</li>
                                <li><strong>Dimensions:</strong> {orderData?.length}m × {orderData?.width}m</li>
                                <li><strong>Price per 10cm×10cm:</strong> Rs. {priceData?.materialPrice}</li>
                                <li><strong>Total Area Cost:</strong> Rs. {priceData?.materialTotal?.toFixed(2)}</li>
                            </ul>
                        </div>
                        <div className="col-md-6">
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
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12">
                            <h4 className="text-end">
                                Sub Total: Rs. {priceData?.subTotal?.toFixed(2)}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-flex justify-content-between">
                        <button 
                            className="btn btn-secondary"
                            onClick={() => navigate('/add-price')}
                            disabled={loading}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Pricing
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={handleSubmitOrder}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    Place Order
                                    <i className="bi bi-check2-circle ms-2"></i>
                                </>
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="alert alert-danger mt-3">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomPayment;