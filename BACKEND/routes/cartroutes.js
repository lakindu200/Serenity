import express from 'express';
import Cart from '../models/cartmodel.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const newCartItem = new Cart(req.body);
    await newCartItem.save();
    const cartItems = await Cart.find();
    res.status(201).json({ items: cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/getAll', async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: 'Item not found' });
    
    cartItem.quantity = req.body.quantity;
    await cartItem.save();
    
    const cartItems = await Cart.find();
    res.status(200).json({ items: cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    const cartItems = await Cart.find();
    res.status(200).json({ items: cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;