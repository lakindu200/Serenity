const express = require('express');
const path = require('path'); // Import the path module
const upload = require('../middleware/multerConfig'); // Import your Multer config file
const Payment = require('../models/paymentmodel'); // Import the Payment model
const Cart = require('../models/cartmodel'); // Import the Cart model

const router = express.Router();

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Checkout Route
router.post('/create', upload.single('receipt'), async (req, res) => {
  const { phone, email, address, deliveryLocation, subtotal, deliveryFee, totalCost, products } = req.body;
  const receiptPath = req.file?.filename || null; // Safely access the filename

  // Validate required fields
  if (!phone || !email || !address || !deliveryLocation || !subtotal || !deliveryFee || !totalCost || !products) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Save payment details to the database
    const payment = new Payment({
      phone,
      email,
      address,
      deliveryLocation,
      subtotal,
      deliveryFee,
      totalCost,
      receiptPath,
      products: JSON.parse(products), // Parse the products array from the request body
    });

    await payment.save();

    // Clear the cart
    await Cart.deleteMany({});

    res.status(200).json({ message: 'Order completed successfully!' });
  } catch (error) {
    console.error('Error completing order:', error.message); // Log the error message
    res.status(500).json({ message: 'Error completing order', error: error.message });
  }
});

// Fetch all payments
router.get('/all', async (req, res) => {
    try {
      // Fetch all payment records from the database
      const payments = await Payment.find({});
      res.status(200).json(payments); // Send the payment data as a response
    } catch (error) {
      console.error('Error fetching payments:', error.message);
      res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
  });

router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error('Error fetching payment details:', error.message);
      res.status(500).json({ message: 'Error fetching payment details', error: error.message });
    }
  });



  // Fetch payment details by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error('Error fetching payment details:', error.message);
      res.status(500).json({ message: 'Error fetching payment details', error: error.message });
    }
  });

  // Update payment status
router.put('/status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json({ message: 'Status updated successfully', payment });
    } catch (error) {
      console.error('Error updating status:', error.message);
      res.status(500).json({ message: 'Error updating status', error: error.message });
    }
  });

  // Delete payment
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const payment = await Payment.findByIdAndDelete(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment:', error.message);
      res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
  });

module.exports = router;