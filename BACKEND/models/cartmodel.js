import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Pre-save middleware to calculate totalPrice
cartSchema.pre('save', function(next) {
    this.totalPrice = this.price * this.quantity;
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
