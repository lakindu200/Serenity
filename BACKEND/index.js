const express=require("express")
const cors=require("cors")
const path = require('path');
const mongoose=require("mongoose")
const cartRoutes = require("./routes/cartroutes");
const checkoutRoutes = require("./routes/paymentroutes");


const app=express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);


const PORT=process.env.PORT||8020







mongoose.connect("mongodb+srv://lakinduch:Lakindu200@serenity.jq1tw.mongodb.net/test?retryWrites=true&w=majority")
.then(()=>{
  
    console.log(`port number => ${PORT}`)
    app.listen(PORT,()=>console.log("server connection successful"))
}).catch((err)=>{
    console.log(err)
})

