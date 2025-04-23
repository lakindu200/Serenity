import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Payment from '../models/paymentmodel.js';
import Cart from '../models/cartmodel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const router = express.Router();

// Serve static files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Checkout Route
router.post('/create', upload.single('receipt'), async (req, res) => {
    const { phone, email, address, deliveryLocation, subtotal, deliveryFee, totalCost, products } = req.body;
    const receiptPath = req.file?.filename || null;

    if (!phone || !email || !address || !deliveryLocation || !subtotal || !deliveryFee || !totalCost || !products) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const payment = new Payment({
            phone,
            email,
            address,
            deliveryLocation,
            subtotal,
            deliveryFee,
            totalCost,
            receiptPath,
            products: JSON.parse(products),
        });

        await payment.save();
        await Cart.deleteMany({});

        res.status(200).json({ message: 'Order completed successfully!' });
    } catch (error) {
        console.error('Error completing order:', error.message);
        res.status(500).json({ message: 'Error completing order', error: error.message });
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