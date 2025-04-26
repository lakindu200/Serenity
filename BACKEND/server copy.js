const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/UserRoutes"); // Ensure this is imported

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes); // Fixes "userRoutes is not defined" error

// MongoDB Connection
mongoose.connect("mongodb+srv://admin:venura*25@cluster0.iku7c.mongodb.net/", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(8000, () => {
        console.log("Server is running on port 5000");
    });
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});
