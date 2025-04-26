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
    const {
      fullName, address, phoneNumber, email, brandModel,
      size, orderNumber, purchaseDate, proofOfPurchase,
      warrantyCertNumber, warrantyStart, warrantyEnd,
      warrantyType, problemType, issueStartDate, resolution
    } = req.body;

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

    console.error('Warranty claim submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting warranty claim',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

export default router;
