const mongoose=require('mongoose');

const trackerModel=new mongoose.Schema({
   productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'productDetails', 
      required: true 
  },
   trackingNumber:{
      type: String, 
      required: true 
   },
   status: { 
      type: String, 
      enum: ['Created', 'In Manufacturing','Packaged','In Transit','Out for Delivery', 'Delivered','Returned','Cancled'], 
      required: true 
    },
   additionalInfo:{
      type: String
    },
   location: { 
     type: String,
     required: true 
   },
   timestamp: { 
     type: Date, 
     default: Date.now 
  },
  isDeleted:{
   type: Boolean, 
   default: false
}
})

module.exports=mongoose.model("TrackerData",trackerModel)