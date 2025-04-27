import mongoose from 'mongoose';

const customProductSchema = new mongoose.Schema({
    length: { 
        type: Number, 
        required: true,
        min: 0 
    },
    width: { 
        type: Number, 
        required: true,
        min: 0 
    },
    color: { 
        type: String, 
        required: true,
        trim: true 
    },
    material: { 
        type: String, 
        required: true,
        enum: ['Innerspring Mattress', 'Memory Foam Mattress', 'Hybrid Mattress'],
        trim: true 
    },
    pillow_type: { 
        type: String, 
        required: true,
        enum: ['decorative', 'sleeping', 'orthopedic'],
        trim: true 
    },
    pillow_size: { 
        type: String, 
        required: true,
        enum: ['small', 'medium', 'large'],
        trim: true 
    },
    pillow_color: { 
        type: String, 
        required: true,
        trim: true 
    },
    pillow_quantity: { 
        type: Number, 
        required: true,
        min: 1
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    paymentAmount: {
        type: Number,
        required: true,
        min: 0
    },
    balance: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model('CustomProduct', customProductSchema);

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

const sampleOrders = [
    {
        "_id": "123456789",
        "length": 100,
        "width": 200,
        "color": "Blue",
        "material": "Memory Foam Mattress",
        "pillow_type": "decorative",
        "pillow_size": "medium",
        "pillow_color": "White",
        "pillow_quantity": 2,
        "clientId": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "address": "123 Street"
        },
        "subtotal": 5000,
        "paymentAmount": 3000,
        "balance": 2000,
        "status": "pending",
        "orderDate": new Date().toISOString()
    }
];