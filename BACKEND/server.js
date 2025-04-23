import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import cartRoutes from './routes/cartroutes.js';
import paymentRoutes from './routes/paymentroutes.js';
import customProductRoutes from './routes/Custom_product_route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB connection established successfully!");
});

// Routes
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
app.use('/custom_product', customProductRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});






