const userModel=require('../model/userModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const {isValidPassword, isValidName, isValidEmail } = require("../validator/validation");

//--------------------------  Register  User --------------------------
const registerUser= async function(req,res){
    try{
        let data=req.body;
        // Check if request body is empty
        if (Object.keys(data).length == 0) { 
            return res.status(400).send({ status: false, message: "Please provide all required details." }) 
        }
        data.email = data.email.toLowerCase();
        let {username,email,password}=data;
  
        // Check if username, email, and password are provided
        if (!username) { return res.status(400).send({ status: false, message: "Username is required." }) }
        if (!email) { return res.status(400).send({ status: false, message: "Email is required." }) }
        if (!password) { return res.status(400).send({ status: false, message: "Password is required." }) }
 
        // Validate email format, username format, and password strength
        if(!isValidEmail(email)){ return res.status(400).send({ status: false, message: "Please provide a valid email address" }) }
        if(!isValidName(username)){ return res.status(400).send({ status: false, message: "Please provide a valid username" }) }
        if(!isValidPassword(password)){ return res.status(400).send({ status: false, message: "Please provide a strong password" }) }

        //  Check if user already registered.
        let isUserExists= await userModel.findOne({email:email})
        if(isUserExists){
            return res.status(400).send({status:false, message:"Email already registor"})
        }

         // Encrypting Password
         let saltRounds = 8;
         let salt = await bcrypt.genSalt(saltRounds);
         let hash = await bcrypt.hash(password, salt);
         data.password = hash;

        let createUser=await userModel.create(data)
        return res.status(201).send({status:true, message:"You've successfully registered.",email:createUser.email})
    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message })
    }
} 

//-------------------------- User Login --------------------------
const userLogin=async function(req,res){
    try{
        let credentials = req.body
        credentials.email = credentials.email.toLowerCase();
        let { email, password } = credentials

        if (Object.keys(credentials).length == 0) {
            return res.status(400).send({ status: false, message: "email and password are required for Log in" })
        }
    
       // Check if email and password are provided
        if (email.trim().length == 0 || password.trim().length == 0) {
            return res.status(400).send({ status: false, message: "both fields are required." })
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "email is not valid" })
        }
        // Check if user exists
        let userDetail = await userModel.findOne({ email: email })
        if (!userDetail) {
            return res.status(404).send({ status: false, message: "User not found with this EmailId" })
        }
        // Check if password matches
        let passwordHash = userDetail.password;
        const passwordMatch = await bcrypt.compare(password, passwordHash)
        if (!passwordMatch) {
            return res.status(400).send({ status: false, message: "Incorrect Password." })
        }
        // Generate JWT token
        let token = jwt.sign({
            userId: userDetail._id.toString(),

        }, "the-secret-key", { expiresIn: '5d' })
        // Set token in response heade
        res.setHeader("Authorization", token)

        return res.status(200).send({ message: "Login successful", token:  token })

    }catch(error){
        return res.status(500).send({status:false, message: error.message})
    }
}

module.exports={registerUser,userLogin}