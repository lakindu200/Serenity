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

    // Start session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

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

      await newClaim.save({ session });
      await session.commitTransaction();
      
      res.status(201).json({ 
        success: true,
        message: 'Claim submitted successfully!',
        claimId: newClaim._id 
      });
    } catch (error) {
      // Rollback in case of error
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

      console.error('Transaction Error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error submitting claim', 
        error: error.message 
      });
    } finally {
      session.endSession();
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

// Update claim status with transaction
router.put('/update-status/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'complete'].includes(status)) {
      throw new Error('Invalid status value');
    }

    const updatedClaim = await WarrantyClaim.findByIdAndUpdate(
      id,
      { status },
      { new: true, session }
    );

    if (!updatedClaim) {
      throw new Error('Claim not found');
    }

    await session.commitTransaction();
    res.status(200).json({
      success: true, 
      message: 'Claim status updated successfully!',
      claim: updatedClaim
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(error.message === 'Claim not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
});

// Delete warranty claim with transaction
router.delete('/admin/claims/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deletedClaim = await WarrantyClaim.findById(id).session(session);

    if (!deletedClaim) {
      throw new Error('Claim not found');
    }

    // Delete associated files
    if (deletedClaim.images) {
      deletedClaim.images.forEach(imagePath => {
        fs.unlink(imagePath, err => {
          if (err) console.error('Error deleting image:', err);
        });
      });
    }
    if (deletedClaim.video) {
      fs.unlink(deletedClaim.video, err => {
        if (err) console.error('Error deleting video:', err);
      });
    }

    await WarrantyClaim.findByIdAndDelete(id).session(session);
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Claim deleted successfully!'
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(error.message === 'Claim not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
});

export default router;