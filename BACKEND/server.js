console.log("Hello");
console.log("This is for test");

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/userRoute");
const app = express();

//Middleware

app.use(express.json());
app.use("/users",router);


mongoose.connect("mongodb+srv://lakinduch:Lakindu200@serenity.jq1tw.mongodb.net/product_db?retryWrites=true&w=majority'/")
.then(()=> console.log("connected to MongoDB"))
.then(() => {
    app.listen(5002);
})
.catch((err) => console.log((err)));