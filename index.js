const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/routes/route");
const app = express();


app.use(express.json())
app.use("/", route)

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Prachi:s1dtmmFIR18QEulS@producttracker.l1vaygz.mongodb.net/productTracker").then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err))

app.listen(5000, ()=>{
    console.log("Server runnig on port",5000)
})
