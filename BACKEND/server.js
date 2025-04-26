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
import { connectDB } from './config/db.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(bodyParser.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static file serving
app.use('/uploads', express.static(uploadsDir));

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

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;