console.log("Hello");
console.log("This is for test");

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/userRoute");
const app = express();
const cors = require("cors");

//Middleware

app.use(express.json());
app.use(cors());
app.use("/users",router);


mongoose.connect("mongodb+srv://Hirusha:3c1kzd6laGxukVoU@hirush98.76vk0.mongodb.net/")
.then(()=> console.log("connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log((err)));

