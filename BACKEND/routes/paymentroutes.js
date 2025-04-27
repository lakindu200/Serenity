import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import Payment from '../models/paymentmodel.js';
import Cart from '../models/cartmodel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create receipts upload directory if it doesn't exist
const receiptsDir = path.join(__dirname, '../uploads/receipts');
if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
}

// Configure multer for receipt upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, receiptsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only .jpeg, .jpg and .png format allowed!'), false);
        }
        cb(null, true);
    }
});

const router = express.Router();

// Serve static files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create payment route with receipt upload
router.post('/create', upload.single('receipt'), async (req, res) => {
  try {
    const {
      phone,
      email,
      address,
      deliveryLocation,
      subtotal,
      deliveryFee,
      totalCost,
      products
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Receipt file is required' 
      });
    }

    const receiptPath = `/uploads/${req.file.filename}`;

    const payment = new Payment({
      phone,
      email,
      address,
      deliveryLocation,
      subtotal: parseFloat(subtotal),
      deliveryFee: parseFloat(deliveryFee),
      totalCost: parseFloat(totalCost),
      receiptPath,
      products: JSON.parse(products),
    });

    await payment.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Order completed successfully!' 
    });

  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error completing order',
      error: error.message 
    });
  }
});

// Fetch all payments
router.get('/all', async (req, res) => {
    try {
        const payments = await Payment.find({});
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
});

// Fetch payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ 
                success: false,
                message: 'Payment not found' 
            });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching payment details',
            error: error.message 
        });
    }
});

// Update payment status
router.put('/status/:id', async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
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
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error.message);
        res.status(500).json({ message: 'Error deleting payment', error: error.message });
    }
});

export default router;