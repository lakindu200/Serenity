import express from 'express';
import cart from '../models/cartmodel.js' // Adjust the path to your Cart model
const router = express.Router();

// Add to Cart Route
router.post('/add', async (req, res) => {
  const { productName, price, quantity } = req.body;

  try {
    // Create a new cart item
    const newCartItem = new Cart({
      productName,
      price,
      quantity,
    });

    // Save the item to the database
    await newCartItem.save();

    // Fetch all items in the cart (optional, depending on your frontend needs)
    const cartItems = await Cart.find({});

    // Send the updated cart back to the frontend
    res.status(201).json({ items: cartItems });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
});

// Fetch All Cart Items
router.get('/getAll', async (req, res) => {
    try {
      const cartItems = await Cart.find({});
      res.status(200).json(cartItems); // Send all cart items to the frontend
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Error fetching cart items' });
    }
  });
  
  // Update Cart Item Quantity
  router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
  
    try {
      // Find the cart item by ID
      const cartItem = await Cart.findById(id);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      // Update the quantity and recalculate the total price
      cartItem.quantity = quantity;
      await cartItem.save(); // This will trigger the pre-save middleware to update totalPrice
  
      // Fetch all cart items to send back to the frontend
      const cartItems = await Cart.find({});
      res.status(200).json({ items: cartItems });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Error updating cart item' });
    }
  });
  
  // Delete Cart Item
  router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the cart item by ID
      const deletedItem = await Cart.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      // Fetch all remaining cart items to send back to the frontend
      const cartItems = await Cart.find({});
      res.status(200).json({ items: cartItems });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      res.status(500).json({ message: 'Error deleting cart item' });
    }
  });
  

export default router;