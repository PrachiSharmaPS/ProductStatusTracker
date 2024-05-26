const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/routes/route");
require ("dotenv").config()
const app = express();


app.use(express.json())
app.use("/", route)

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_CLUSTER_LINK).then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err))

app.listen(5000, ()=>{
    console.log("Server runnig on port",5000)
})
