import mongoose from 'mongoose';

const warrantySchema = new mongoose.Schema({
  fullName: String,
  address: String,
  phoneNumber: String,
  email: String,
  brandModel: String,
  size: [String],
  orderNumber: String,
  purchaseDate: String,
  proofOfPurchase: String,
  warrantyCertNumber: String,
  warrantyStart: String,
  warrantyEnd: String,
  warrantyType: String,
  problemType: String,
  issueStartDate: String,
  images: [String],
  video: String,
  resolution: String,
  status: { 
    type: String, 
    enum: ['pending', 'complete'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

export default mongoose.model('WarrantyClaim', warrantySchema);