import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
    enum: ['Colombo', 'Outside Colombo'], // Only allow these two options
  },
  subtotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  receiptPath: {
    type: String,
    required: true,
  },
  products: [
    {
      productName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ['Pending', 'Complete'], // Only allow these two statuses
    default: 'Pending', // Default status is "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;