import express from 'express';
import Product from '../models/custom_product.js';

const router = express.Router();

// Get all products with populated client details
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ orderDate: -1 }); // Sort by newest first

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

// Add new custom order
router.post('/add', async (req, res) => {
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
            clientName,
            clientEmail,
            clientPhone,
            clientAddress,
            subtotal,
            paymentAmount,
            balance,
            orderDate = new Date()
        } = req.body;

        // Validate required fields
        if (!length || !width || !color || !material || 
            !pillow_type || !pillow_size || !pillow_color || 
            !pillow_quantity || !clientName || !clientEmail ||
            !clientPhone || !clientAddress || !subtotal || 
            !paymentAmount || balance === undefined) {
            return res.status(400).json({
                status: "Error",
                message: "All fields are required"
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
            clientName,
            clientEmail,
            clientPhone,
            clientAddress,
            subtotal: Number(subtotal),
            paymentAmount: Number(paymentAmount),
            balance: Number(balance),
            orderDate: new Date(orderDate)
        });

        const savedProduct = await newProduct.save();
        
        res.status(201).json({
            status: "Success",
            message: "Order placed successfully",
            product: savedProduct
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({
            status: "Error",
            message: "Failed to place order",
            error: err.message
        });
    }
});

// Get single order by ID
router.get('/get/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                status: "Error",
                message: "Order not found"
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
            message: "Failed to fetch order",
            error: err.message
        });
    }
});

export default router;