import express from 'express';
import Product from '../models/custom_product.js';

const router = express.Router();

// Add new product
router.route('/add').post(async (req, res) => {
    try {
        const {
            length,
            width,
            color,
            material,
            pillow_type,
            pillow_size,
            pillow_color,
            pillow_quantity,
            subtotal,
            paymentAmount,
            balance,
            orderDate = new Date()
        } = req.body;

        // Validate required fields
        if (!length || !width || !color || !material || 
            !pillow_type || !pillow_size || !pillow_color || 
            !pillow_quantity || !subtotal || !paymentAmount || balance === undefined) {
            return res.status(400).json({
                status: "Error",
                message: "All fields are required including payment details"
            });
        }

        const newProduct = new Product({
            length: Number(length),
            width: Number(width),
            color,
            material,
            pillow_type,
            pillow_size,
            pillow_color,
            pillow_quantity: Number(pillow_quantity),
            subtotal: Number(subtotal),
            paymentAmount: Number(paymentAmount),
            balance: Number(balance),
            orderDate: new Date(orderDate)
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({
            status: "Success",
            message: "Product added successfully",
            product: savedProduct
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to add product",
            error: err.message
        });
    }
});

// Get all products
router.route('/').get(async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status: "Success",
            products: products
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to fetch products",
            error: err.message
        });
    }
});

// Update product
router.route('/update/:id').put(async (req, res) => {
    try {
        const {
            length,
            width,
            color,
            material,
            pillow_type,
            pillow_size,
            pillow_color,
            pillow_quantity,
            subtotal
        } = req.body;

        const updateProduct = {
            length: Number(length),
            width: Number(width),
            color,
            material,
            pillow_type,
            pillow_size,
            pillow_color,
            pillow_quantity: Number(pillow_quantity),
            subtotal: Number(subtotal)
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            updateProduct,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                status: "Error",
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to update product",
            error: err.message
        });
    }
});

// Delete product
router.route('/delete/:id').delete(async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({
                status: "Error",
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to delete product",
            error: err.message
        });
    }
});

// Get product by ID
router.route('/get/:id').get(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                status: "Error",
                message: "Product not found"
            });
        }

        res.status(200).json({
            status: "Success",
            product: product
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to fetch product",
            error: err.message
        });
    }
});

export default router;