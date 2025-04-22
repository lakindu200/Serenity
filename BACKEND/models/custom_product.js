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
    balance: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);
export default Product;