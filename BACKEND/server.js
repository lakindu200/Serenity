import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import warrantyRoutes from './routes/warrantyRoutes.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import cartroutes from './routes/cartroutes.js';
import paymentroutes from './routes/paymentroutes.js';
import express from 'express';

dotenv.config();

const app = express();
const port = 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Call the connect function before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Server failed to start:", error);
});

// Enable debugging for transactions in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

// Routes
app.use('/api/warranty', warrantyRoutes);

export default app;
// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/product", productRoutes);
app.use('/api/cart', cartroutes);
app.use('/api/payment', paymentroutes);

app.get("/", (req, res) => {
    res.send("API Working");
});

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(port, () => console.log(`Server listening on localhost:${port}`));
}).catch((error) => {
    console.error("Server failed to start:", error);
    process.exit(1);
});

export default app;