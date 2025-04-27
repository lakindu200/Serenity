import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import WarrantyClaim from '../models/warrantyModel.js';
import mongoose from 'mongoose';
import fs from 'fs';

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
});

// Submit warranty claim
router.post('/submit-claim', upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Received form data:', req.body);
    console.log('Received files:', req.files);

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error('No form data received');
    }

    // Extract form data
    const {
      fullName, address, phoneNumber, email,
      brandModel, size, orderNumber, purchaseDate,
      proofOfPurchase, warrantyCertNumber,
      warrantyStart, warrantyEnd, warrantyType,
      problemType, issueStartDate, resolution
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber) {
      throw new Error('Missing required fields');
    }

    // Parse size array from JSON string
    const sizeArray = JSON.parse(size);

    const imagePaths = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const videoPath = req.files['video'] ? req.files['video'][0].path : null;

    const newClaim = new WarrantyClaim({
      fullName,
      address,
      phoneNumber,
      email,
      brandModel,
      size: sizeArray,
      orderNumber,
      purchaseDate,
      proofOfPurchase,
      warrantyCertNumber,
      warrantyStart,
      warrantyEnd,
      warrantyType,
      problemType,
      issueStartDate,
      images: imagePaths,
      video: videoPath,
      resolution
    });

    await newClaim.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Warranty claim submitted successfully!',
      claimId: newClaim._id
    });
  } catch (error) {
    await session.abortTransaction();
    
    // Delete uploaded files if transaction failed
    if (req.files) {
      if (req.files['images']) {
        req.files['images'].forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Error deleting image:', err);
          });
        });
      }
      if (req.files['video']) {
        fs.unlink(req.files['video'][0].path, err => {
          if (err) console.error('Error deleting video:', err);
        });
      }
    }

    console.error('Warranty claim error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit warranty claim'
    });
  } finally {
    session.endSession();
  }
});

// Add this route to get all warranty claims
router.get('/admin/claims', async (req, res) => {
  try {
    const claims = await WarrantyClaim.find({})
      .sort({ createdAt: -1 }); // Sort by newest first
    console.log('Claims fetched:', claims.length); // Add logging
    res.json(claims);
  } catch (error) {
    console.error('Error fetching warranty claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching warranty claims',
      error: error.message
    });
  }
});

export default router;
