const nodemailer=require('nodemailer');
require ("dotenv").config()

const sendMail=async(mailData)=>{
    try{
        
        // Create a transporter with Gmail SMTP settings
        const transporter = nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure:false,
            auth: {
               user: process.env.USER_EMAIL,
               pass: process.env.PASSWORD
            }
        });
        // Send email
         let info=await transporter.sendMail(mailData);
        
         return info

    }catch(err){
        return ({status: false, message:err.message})
    }
}


module.exports={sendMail}