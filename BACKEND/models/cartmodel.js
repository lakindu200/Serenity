import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CartSchema = new Schema({
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
    min: [1, 'Quantity must be at least 1'],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

CartSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.price;
  next();
});

export default mongoose.model('Cart', CartSchema);
