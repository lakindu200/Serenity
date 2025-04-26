import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to calculate totalPrice
CartSchema.pre('save', function(next) {
  try {
    if (!this.price || isNaN(this.price) || this.price <= 0) {
      throw new Error('Invalid price: Price must be a positive number');
    }
    if (!this.quantity || isNaN(this.quantity) || this.quantity <= 0) {
      throw new Error('Invalid quantity: Quantity must be a positive number');
    }
    
    this.totalPrice = this.quantity * this.price;
    this.updatedAt = Date.now(); // Update the updatedAt field when item is modified
    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
