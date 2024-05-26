const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("../validator/validation");
const userModel = require("../model/userModel");
const productModel = require("../model/productModel");

//   User Authentication
const authenticate = function (req, res, next) {
  try {
    const Bearer = req.headers["authorization"];

    // Check if Bearer token is present
    if (!Bearer) {
      return res.status(400).send({ status: false, message: "token must be present" });
    } else {
      // Split Bearer token
      const token = Bearer.split(" ");
      if (token[0] !== "Bearer") {
        return res.status(400).send({ status: false, message: "Select Bearer Token in headers" });
      }

      // Verify JWT token
      jwt.verify(token[1], "the-secret-key", function (err, decodedToken) {
        if (err) {
          if (
            err.message == "invalid token" ||
            err.message == "invalid signature"
          ) {
            return res.status(403).send({ status: false, message: "Token in not valid" });
          }
          if (err.message == "jwt expired") {
            return res
              .status(403)
              .send({ status: false, message: "Token has been expired" });
          }
          return res.status(403).send({ status: false, message: err.message });
        } else {
           // If token is valid, set login user ID and proceed
          req.loginUserId = decodedToken.userId; 
          next();
        }
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//  User Authorization
const authorization = async function (req, res, next) {
  try {
    const userId = req.loginUserId;
    let productId=req.body.productId;

    // Check if the userId is a valid ObjectId
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Please provide a valid UserId" });
    }

    // Find the user by userId
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ status: false, message: "user does not exists" });
    }
    req.userData = user;

    // Find the product by productId
    let product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).send({ status: false, message: "Product does not exists" });
    }
    let tokenUserId = req.loginUserId; 

    // Check if the user is authorized to perform the task
    if (tokenUserId != product.userId) {
      return res.status(401).send({ status: false, message: "You are not authorised to perform this task"});
    }
  
   
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const adminAauthorization = async function (req, res, next) {
  try {
    const userId = req.loginUserId;
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Please provide a valid UserId" });
    }
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ status: false, message: "user does not exists" });
    }
    req.userData = user;
    if(user.role!="Admin"){
   
      return res.status(401).send({ status: false, message: "You are not authorised to perform this task" });
    }
  
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authenticate, authorization,adminAauthorization };
