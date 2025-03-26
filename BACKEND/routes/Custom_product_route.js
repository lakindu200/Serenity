import express from 'express';
import Product from '../models/custom_product.js';

const router = express.Router();

// Fix the add route
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
            orderDate = new Date() 
        } = req.body;

        // Validate 
        if (!length || !width || !color || !material || 
            !pillow_type || !pillow_size || !pillow_color || !pillow_quantity || !subtotal) 
        {
            return res.status(400).json({
                status: "Error",
                message: "All fields are required including subtotal"
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


router.route('/').get((req, res) => {
    Product.find()
        .then(products => {
            res.status(200).json({
                status: "Success",
                products: products
            });
        })
        .catch(err => {
            console.error('Error fetching products:', err);
            res.status(400).json({
                status: "Error",
                message: "Failed to fetch products",
                error: err.message
            });
        });
});

router.route('/update/:id').put(async (req, res) => {
    let Id = req.params.id;
    const { length, width, color, material,pillow_type, pillow_size,pillow_color,pillow_quantity,subtotal } = req.body;

    const updateProduct = {
        length,
        width,
        color,
        material,
        pillow_type,
        pillow_size,
        pillow_color,
        pillow_quantity,
        subtotal
    };

    try {
        await Product.findByIdAndUpdate(Id, updateProduct);
        res.status(200).send({ status: "Product updated" });
    } catch (err) {
        console.error(err);
        res.status(400).send({ status: "Product not updated", error: err.message });
    }
});

router.route('/delete/:id').delete(async (req, res) => {
    let Id = req.params.id;
    try {
        await Product.findByIdAndDelete(Id);
        res.status(200).send({ status: "Product deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(400).send({ status: "Product not deleted", error: err.message });
    }
});

router.route('/get/:id').get(async (req, res) => {
    let Id = req.params.id;
    try {
        const product = await Product.findById(Id);
        res.status(200).send({ status: "Product fetched", product: product });
    } catch (err) {
        console.error(err.message);
        res.status(400).send({ status: "Product not fetched", error: err.message });
    }
});

export default router;