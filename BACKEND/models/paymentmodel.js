import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
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
    enum: ['Colombo', 'Outside Colombo'],
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
  products: [{
    productName: String,
    price: Number,
    quantity: Number,
    totalPrice: Number
  }],
  status: {
    type: String,
    enum: ['Pending', 'Complete'],
    default: 'Pending',
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', PaymentSchema);