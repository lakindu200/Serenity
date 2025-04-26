import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import Payment from '../models/paymentmodel.js';
import Cart from '../models/cartmodel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for receipt upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/receipts');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Serve static files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create payment route with receipt upload
router.post('/create', upload.single('receipt'), async (req, res) => {
    try {
        const {
            phone, email, address, deliveryLocation,
            subtotal, deliveryFee, totalCost, products
        } = req.body;

        const newPayment = new Payment({
            phone,
            email,
            address,
            deliveryLocation,
            subtotal: Number(subtotal),
            deliveryFee: Number(deliveryFee),
            totalCost: Number(totalCost),
            products: JSON.parse(products),
            receiptImage: req.file ? req.file.path : null,
            status: 'Pending'
        });

        await newPayment.save();

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            payment: newPayment
        });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
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