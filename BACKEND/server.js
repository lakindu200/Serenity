import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cartroutes from './routes/cartroutes.js';
import paymentroutes from './routes/paymentroutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("!!!!MongoDB connection established successfully!");
});

app.use('/api/cart', cartroutes);
app.use('/api/payment', paymentroutes); // Use the payment routes

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});