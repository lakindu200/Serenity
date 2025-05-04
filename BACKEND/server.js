import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import customProductRoutes from './routes/Custom_product_route.js'; 
import clientDetailsRoutes from './routes/Client_details_route.js';
import clientRoutes from './routes/Client_details_route.js';

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

// Initialize express app and load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 4000; // Change to match frontend expectation

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept'],
}));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

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

// Add this before your routes
const validateRequest = (req, res, next) => {
    // Skip validation for multipart form data requests
    if (req.is('multipart/form-data')) {
        return next();
    }

    // Only validate POST/PUT requests with JSON content
    if ((req.method === 'POST' || req.method === 'PUT') && 
        req.headers['content-type'] === 'application/json') {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Request body is empty'
            });
        }
    }
    next();
};

// Add the middleware
app.use(validateRequest);

// Add error logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Add this before your routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Add this before your routes
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Add this middleware before your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Routes
app.use('/api/warranty', warrantyRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartroutes);
app.use('/api/payment', paymentroutes);
app.use('/api/custom_product', customProductRoutes);
app.use('/api/client_details', clientDetailsRoutes);
app.use('/api/client_details', clientRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

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