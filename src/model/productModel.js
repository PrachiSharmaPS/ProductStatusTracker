const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
      productName: { 
         type: String, 
         required: true 
      },
      userId: { 
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'userData',  
         required: true 
      },
      description: { 
         type: String 
      },
      deliveryAddress: { 
         type: String, 
      },
      trackingNumber: { 
        type: String
      },
      isDeleted:{
         type: Boolean, 
         default: false
     },
     quantity:{
      type: Number,
      default:1
     },
     price:{
      type: Number
     },
   additionalInfo:{
      type: String
    },
    }, { timestamps: true })

module.exports = mongoose.model("productDetails", productModel)