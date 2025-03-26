import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddPrice() {
    const navigate = useNavigate();
    const [materialPrice, setMaterialPrice] = useState(0);
    const [pillowTypePrice, setPillowTypePrice] = useState(0);
    const [pillowSizePrice, setPillowSizePrice] = useState(0);
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const savedPrices = JSON.parse(localStorage.getItem('priceData')) || {};
        if (savedPrices) {
            setMaterialPrice(savedPrices.materialPrice || 0);
            setPillowTypePrice(savedPrices.pillowTypePrice || 0);
            setPillowSizePrice(savedPrices.pillowSizePrice || 0);
        }

        const productData = JSON.parse(localStorage.getItem('tempProductData'));
        if (!productData) {
            alert("Please add product details first");
            navigate('/customize');
            return;
        }
        setOrderData(productData);
    }, [navigate]);

    const calculateTotals = () => {
        // Calculate material total (10cm x 10cm = 0.01 m²)
        const area = orderData.length * orderData.width;
        const materialTotal = (area * 100) * materialPrice; // Convert to 10cmx10cm units

        // Calculate pillow total
        const pillowTotal = (pillowTypePrice + pillowSizePrice) * orderData.pillow_quantity;

        // Save prices to localStorage
        const priceData = {
            materialPrice,
            pillowTypePrice,
            pillowSizePrice,
            materialTotal,
            pillowTotal,
            subTotal: materialTotal + pillowTotal
        };
        localStorage.setItem('priceData', JSON.stringify(priceData));

        navigate('/payment');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateTotals();
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Set Prices</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Material Price (per 10cm×10cm)
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">Rs.</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={materialPrice}
                                            onChange={(e) => setMaterialPrice(Number(e.target.value))}
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Pillow Type Base Price
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">Rs.</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={pillowTypePrice}
                                            onChange={(e) => setPillowTypePrice(Number(e.target.value))}
                                            min="0"
                                            step="0.01"
                                            
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Pillow Size Additional Price
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">Rs.</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={pillowSizePrice}
                                            onChange={(e) => setPillowSizePrice(Number(e.target.value))}
                                            min="0"
                                            step="0.01"
                                            
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-end mt-3">
                            <button type="submit" className="btn btn-primary">
                                Calculate & Continue
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPrice;