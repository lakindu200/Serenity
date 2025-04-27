import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

// Route imports
import warrantyRoutes from './routes/warrantyRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartroutes from './routes/cartroutes.js';
import paymentroutes from './routes/paymentroutes.js';

// Database configuration
import connectDB from './config/db.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
dotenv.config();
// Make sure dotenv is loaded before any database connection
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable debugging for transactions in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// Routes
app.use('/api/warranty', warrantyRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartroutes);
app.use('/api/payment', paymentroutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URL:', process.env.MONGODB_URL?.substring(0, 20) + '...');
    
    await connectDB();
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API available at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;