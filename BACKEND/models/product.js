const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Product_name: { type: String, required: true },
    product_type: { type: String, required: true },
    Category: { type: String, required: true },
    size: { type: String, required: true },
    Material: { type: String, required: true },
    price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true }
});

module.exports = mongoose.model("User", userSchema);
