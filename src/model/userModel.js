const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email:{ //address
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Customer'], 
        default: "Customer",
        required: true 
    },
    isDeleted:{
        type: Boolean, 
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("userData", userModel)