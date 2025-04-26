import express from 'express';
import Cart from '../models/cartmodel.js';

const router = express.Router();

// Add to cart
router.post('/add', async (req, res) => {
    try {
        const { productId, productName, price, quantity, image } = req.body;

        if (!productId || !productName || !price || !quantity || !image) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const cartItem = new Cart({
            productId,
            productName,
            price: Number(price),
            quantity: Number(quantity),
            image,
            totalPrice: Number(price) * Number(quantity)
        });

        await cartItem.save();
        const cartItems = await Cart.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            message: 'Product added to cart successfully',
            items: cartItems
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding product to cart',
            error: error.message
        });
    }
});

// Get all cart items
router.get('/getAll', async (req, res) => {
    try {
        const cartItems = await Cart.find().sort({ createdAt: -1 });
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching cart items',
            error: error.message 
        });
    }
});

// Update cart item quantity
router.put('/update/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        const cartItem = await Cart.findById(req.params.id);
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        const cartItems = await Cart.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            items: cartItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete cart item
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log('Attempting to delete cart item with ID:', req.params.id);
        
        const deletedItem = await Cart.findByIdAndDelete(req.params.id);
        
        if (!deletedItem) {
            console.log('Cart item not found with ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: `Cart item with ID ${req.params.id} not found`
            });
        }

        const cartItems = await Cart.find().sort({ createdAt: -1 });
        
        console.log('Item deleted successfully, remaining items:', cartItems.length);
        
        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            items: cartItems
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting cart item',
            error: error.message
        });
    }
});

// Clear entire cart
router.delete('/clear', async (req, res) => {
    try {
        await Cart.deleteMany({});
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            items: []
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
});

export default router;