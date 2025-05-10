import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    color: { type: String, required: true },
    material: { type: String, required: true },
    pillow_type: { type: String, required: true },
    pillow_size: { type: String, required: true },
    pillow_color: { type: String, required: true },
    pillow_quantity: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    subtotal: { type: Number, required: true },
    paymentAmount: { type: Number, required: true },
    balance: { type: Number, required: true, default: 0 }
});

const Product = mongoose.model('Product', productSchema);
export default Product;

const handleSubmitOrder = async () => {
    if (!paymentAmount) {
        setError('Please enter payment amount');
        return;
    }

    const paid = parseFloat(paymentAmount) || 0;
    const total = priceData?.subTotal || 0;
    
    if (paid < total) {
        setError('Payment amount must be at least equal to the total amount');
        return;
    }

    setLoading(true);
    try {
        const productPayload = {
            ...orderData,
            orderDate: new Date(),
            subtotal: priceData.subTotal,
            paymentAmount: parseFloat(paymentAmount),
            balance: calculateBalance(paymentAmount), // Add balance calculation
        };

        const productResponse = await fetch('http://localhost:8000/custom_product/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productPayload)
        });

        // Rest of your existing code...
    } catch (err) {
        console.error('Error:', err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};