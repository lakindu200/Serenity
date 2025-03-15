import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    color: { type: String, required: true },
    material: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product;