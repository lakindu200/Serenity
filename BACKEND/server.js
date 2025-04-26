import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
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