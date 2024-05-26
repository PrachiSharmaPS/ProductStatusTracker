const productModel=require('../model/productModel');
const trackerModel=require('../model/trackerMode');
const {sendMail} = require("./sendMail");


const createTrackingEvent=async function(req,res){
    try{
        let data=req.body;
        let role=req.userData.role;

        // Check if user is an admin
        if(role!="Admin"){
         return res.status(401).send({ status: false, message: "You are not authorized to perform this task" }) 
        }
        let{location,trackingCode}=data
 
        // Check if all required data is provided
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please provide all required details." }) }
        if (!trackingCode) { return res.status(400).send({ status: false, message: "Tracking Code is required." }) }

       // Find product details by tracking code
       let productDetail=await productModel.findOne({trackingNumber:trackingCode, isDeleted:false}).populate('userId')
       if(!productDetail){
        return res.status(404).send({status:false, message:"Invalid Tracking code"})
       }
       // Check if tracking event already exists for the product
       let trackingDetail=await trackerModel.findOne({trackingNumber:trackingCode})
       if(trackingDetail){
        return res.status(404).send({status:false, message:"Tracking Event is already created you can update tracking event now"})
       }
      
        let trackingData={
            productId:productDetail._id,
            status:'Created',
            location:location,
            trackingNumber:trackingCode
        };
        //  Email data
        const mailData={
            from: {
                name:"Prachi",
                address:process.env.USER_EMAIL
            },
            to: productDetail.userId.email,
            subject: "Update on Your Order: Tracking Code and Status",
            html: `<p style="color: black;">Dear ${productDetail.userId.username},<br><br>
            We hope this email finds you well.<br><br>We are writing to inform you that the Tracking Status of your product <b>${productDetail.productName}</b> has been updated. Below are the details of the latest update:<br><br><b>Product: </b>${productDetail.productName}<br>
            <b>Current Status:</b> Created<br>
            <b>Tracking Number:</b> ${trackingCode}<br><br>Thank you for shopping with us! If you have any questions or need further assistance, please do not hesitate to contact our customer support team.<br><br>Best regards,</p>`
        }
      
        let trackerDetails=await trackerModel.create(trackingData)
        if(!trackerDetails){ 
            return res.status(400).send({status:false, message:trackerDetails})
        } 
        // Send notification email
        await sendMail(mailData)
        return res.status(201).send({status:true, data:trackerDetails})

    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const updateTrackingEvent=async function(req,res){
    try{
        let data=req.body;
        let role=req.userData.role;
        // Check if user is authorized
        // if(role!="Admin"){
        //  return res.status(403).send({ status: false, message: "You are not authorized to perform this task" }) 
        // }
        let{status,location,trackingNumber,additionalInfo}=data
 
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please provide all required details." }) }
        if (!status) { return res.status(400).send({ status: false, message: "status is required." }) }
       
        // Validate request data
        if(status!="Delivered" && status!="Returned"){
            if (!location) { return res.status(400).send({ status: false, message: "Location is required." }) }
        }
        if (!trackingNumber) { return res.status(400).send({ status: false, message: "Tracking Number is required." }) }

        // Fetch tracking and product details
        let trackingDetail=await trackerModel.findOne({trackingNumber:trackingNumber,isDeleted:false}).populate('productId')
        
        if(!trackingDetail){
         return res.status(404).send({status:false, message:"Tracking Event is not found"})
        }
       let productDetail=await productModel.findOne({trackingNumber:trackingNumber}).populate('userId')
       
       if(!productDetail){
        return res.status(404).send({status:false, message:"Product not found"})
       }
       if(status=="Delivered"){
        location=productDetail.deliveryAddress;
       }
       
        //  Trigger Email Logic
        const mailData={
            from: {
                name:"Prachi",
                address:process.env.USER_EMAIL
            },
            to: productDetail.userId.email,
            subject: "Update on Your Order: Tracking Code and Status",
            html: `<p style="color: black;">Dear ${productDetail.userId.username},<br><br>
            We hope this email finds you well.<br><br>We are writing to inform you that the Tracking Status of your product <b>${productDetail.productName}</b> has been updated. Below are the details of the latest update:<br><br><b>Product: </b>${productDetail.productName}<br>
            <b>Current Status:</b> ${status}<br>
            <b>Tracking Number:</b> ${trackingNumber}<br><br>Thank you for shopping with us! If you have any questions or need further assistance, please do not hesitate to contact our customer support team.<br><br>Best regards,</p>`        }

         // Update tracking details
        let trackerDetails=await trackerModel.updateOne(
            {trackingNumber: trackingNumber},{ $set: { status: status ,location:location,additionalInfo:additionalInfo} })
            if (trackerDetails.modifiedCount === 0) {
                return res.status(404).send({ status: false, message: "No Update Found" });
              } else {
                await sendMail(mailData)
                return res.status(200).send({ status: true, message: "Product updated successfully"});
              }

    }catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const getTrackingEvent=async function(req,res){
    try{
        let trackingNumber=req.query.trackingNumber;

        // Find tracking event based on tracking number
        let trackingData=await trackerModel.findOne({trackingNumber:trackingNumber}).populate({
            path: 'productId',
            select: 'productName description deliveryAddress status -_id'
        }).select('location -_id additionalInfo location status');

        // If no tracking data found, return 404 Not Found
        if(!trackingData){
            return res.status(400).send({status: false,message:"Invalid Tracking Number"})
        }
        // Return successful response with tracking event data
        return res.status(200).send({status: true,data:trackingData})

    }catch(err){
        return res.status(500).send({status: false,message:err.message})
    }
}


const getFilterTrackingEvent=async function(req,res){
    try{
        let filter=req.query.filter;
        let role=req.userData.role;

        // Check user role
        if(role!="Admin"){
            return res.status(403).send({ status: false, message: "You are not authorized to perform this task" }) 
           }

        // Retrieve tracking data based on filter
        let trackingData=await trackerModel.find({status:filter}).populate({
            path: 'productId',
            select: 'productName description deliveryAddress status'
        }).select('location -_id additionalInfo location ')
        if(!trackingData){
            return res.status(404).send({status: false,message:"No Data Found"})
        }

        // Return tracking data with 200 status
        return res.status(200).send({status: true,data:trackingData})

    }catch(err){
        return res.status(500).send({status: false,message:err.message})
    }
}

const deleteTrackingEvent=async function(req,res){
    try{
        let trackingNumber=req.body.trackingNumber;
        let role=req.userData.role;

        // Check user role
        if(role!="Admin"){
            return res.status(403).send({status:false, message:"Yor are not allowed to perform this task"})
        }

        // Delete tracking event from database
        let trackingData = await trackerModel.deleteOne(  { trackingNumber: trackingNumber } );
  
        // Check if tracking event was found and deleted
        if (trackingData.deletedCount === 0) {
            
            return res.status(404).send({ status: false, message: "No Traking Data found" });
          } else {
            // Find product details associated with the deleted tracking event
            let productDetail=await productModel.findOne({trackingNumber:trackingNumber}).populate('userId')
             
        // Trigger email notification to user
        const mailData={
            from: {
                name:"Prachi",
                address:process.env.USER_EMAIL
            },
            to: productDetail.userId.email,
            subject: "Update on Your Order: Tracking Code and Status",
            html: `<p style="color: black;">Dear ${productDetail.userId.username},<br><br>
            We hope this email finds you well.<br><br>We are writing to inform you that the Tracking Status of your product <b>${productDetail.productName}</b> has been updated. Below are the details of the latest update:<br><br><b>Product: </b>${productDetail.productName}<br>
            <b>Current Status:</b> Deleted <br>
            <b>Tracking Number:</b> ${trackingNumber}<br><br>Thank you for shopping with us! If you have any questions or need further assistance, please do not hesitate to contact our customer support team.<br><br>Best regards,</p>`        }
            await sendMail(mailData)

            // Return success response
            return res.status(200).send({ status: true, message: "Tracking Event Deleted successfully" });
          }

    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports={createTrackingEvent,getTrackingEvent,updateTrackingEvent,deleteTrackingEvent,getFilterTrackingEvent}