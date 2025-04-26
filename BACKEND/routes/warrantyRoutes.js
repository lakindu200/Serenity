import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import WarrantyClaim from '../models/warrantyModel.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'), false);
    }
  },
}).fields([
  { name: 'images', maxCount: 3 },
  { name: 'video', maxCount: 1 },
]);

// Submit warranty claim
router.post('/submit-claim', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const {
        fullName, address, phoneNumber, email, brandModel,
        size, orderNumber, purchaseDate, proofOfPurchase,
        warrantyCertNumber, warrantyStart, warrantyEnd,
        warrantyType, problemType, issueStartDate, resolution
      } = req.body;

      const imagePaths = req.files['images'] ? req.files['images'].map(file => file.path) : [];
      const videoPath = req.files['video'] ? req.files['video'][0].path : null;

      const newClaim = new WarrantyClaim({
        fullName, address, phoneNumber, email, brandModel,
        size, orderNumber, purchaseDate, proofOfPurchase,
        warrantyCertNumber, warrantyStart, warrantyEnd,
        warrantyType, problemType, issueStartDate,
        images: imagePaths,
        video: videoPath,
        resolution,
      });

      await newClaim.save();
      res.status(201).json({ message: 'Claim submitted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error submitting claim', error });
    }
  });
});

// Get all warranty claims
router.get('/admin/claims', async (req, res) => {
  try {
    const claims = await WarrantyClaim.find();
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching warranty claims', error });
  }
});

// Update claim status
router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'complete'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedClaim = await WarrantyClaim.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedClaim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json({ 
      message: 'Claim status updated successfully!', 
      updatedClaim 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating claim status', error });
  }
});

// Delete warranty claim
router.delete('/admin/claims/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClaim = await WarrantyClaim.findByIdAndDelete(id);

    if (!deletedClaim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json({ message: 'Claim deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting claim', error });
  }
});

export default router;