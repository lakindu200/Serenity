import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    Product_name: { type: String, required: true, trim: true },
    product_type: {
        type: String,
        required: true,
        enum: ["Mattress", "Pillow", "Bedding Accessory"]
    },
    Category: {
        type: String,
        required: true,
        enum: ["Luxury", "Orthopedic", "Cooling", "Budget-Friendly"]
    },
    size: {
        type: String,
        required: true,
        enum: ["Twin", "Full", "Queen", "King", "Standard", "Custom"]
    },
    Material: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock_quantity: { type: Number, required: true, min: 0 },
    image_path: { type: String },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"] 
    },
}, { timestamps: true });

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;