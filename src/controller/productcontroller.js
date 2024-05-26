const productModel = require("../model/productModel");
const trackerModel = require("../model/trackerMode");
const userModel = require("../model/userModel");
const uid = require("uuid");
const { isValidNumber, isValidPrice } = require("../validator/validation");

//  Controller to add Product
const createProduct = async function (req, res) {
  try {
    let data = req.body;
    let userId = req.loginUserId;
    let { productName, description, deliveryAddress, quantity, price } = data;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({status: false,message: "Please provide all required details.",
        });
    }

    // Validate each required field and send appropriate response if any is missing

    if (!productName) {
      return res.status(400).send({ status: false, message: "Product Name is required." });
    }
    if (!deliveryAddress) {
      return res.status(400).send({ status: false, message: "Delivery Address is required." });
    }
    if (!quantity) {
      return res.status(400).send({ status: false, message: "Quantity is required." });
    }
    if (!price) {
      return res.status(400).send({ status: false, message: "Price is required." });
    }
    if (!isValidNumber(quantity)) {
      return res.status(400).send({ status: false, message: "Invalid quantity provided." });
    }
    if (!isValidPrice(price)) {
      return res.status(400).send({ status: false, message: "Invalid price provided" });
    }

    // Creating a unique tracking code for the product
    const trackingCode = uid.v4();
    let productData = {
      productName: productName,
      userId: userId,
      trackingNumber: trackingCode,
      description: description,
      deliveryAddress: deliveryAddress,
      quantity: quantity,
      price: price,
    };

    let productDetails = await productModel.create(productData);

    // Convert the product details to an object and remove unwanted fields

    productDetails = productDetails.toObject();
    delete productDetails.isDeleted;
    delete productDetails.userId;
    if (productDetails) {
      return res.status(201).send({status: true, message: "Product has been successfully created.",data: productDetails,
        });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message:"Internal Server Error: " +err.message });
  }
};

const getProducts = async function (req, res) {
  try {
    let userId = req.loginUserId;
    
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ status: false, message: "user does not exists" });
    }
 
    let role = user.role;
 // Logic for:- Only Admins can see all products that are not deleted
    if (role == "Admin") {
      let productdata = await productModel.find({ isDeleted: false }).populate("userId");

      if (productdata.length == 0) {
        return res.status(404).send({ status: true, message: "Product not available" });
      }
      return res.status(200).send({ status: true, data: productdata });
    } else {

  // Non-admin users can only see their own products that are not deleted
      let productdata = await productModel.find({ userId: userId, isDeleted: false }).select(" -isDeleted -userId -__v"); //.populate('userId');

      if (productdata.length == 0) {
        return res.status(404).send({ status: true, message: "No products available for the current user" });
      }
      return res.status(200).send({ status: true, data: productdata });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message:"Internal Server Error: " + err.message  });
  }
};

const updateProduct = async function (req, res) {
  try {
    let data = req.body;
    let { productId, quantity, price } = data;
    let loginUserId = req.loginUserId;
    let updateObject = {};

    // Check if productId is provided
    if (!productId) {
      return res.status(400).send({ status: false, message: "Please provide Product Id" });
    }

    // Validate and set the quantity if provided
    if (quantity) {
      if (!isValidNumber(quantity)) {
        return res.status(400).send({ status: false, message: "Invalid quantity provided" });
      }
      updateObject.quantity = quantity;
    }
    // Validate and set the price if provided
    if (price) {
      if (!isValidPrice(price)) {
        return res.status(400).send({ status: false, message: "Invalid price provided" });
      }
      updateObject.price = price;
    }
    // Update the product details
   
    let productDetails = await productModel.updateOne(
      { _id: productId, userId: loginUserId, isDeleted:false },
      { $set: updateObject }
    );
    // Check if any product was updated
    if (productDetails.modifiedCount === 0) {
      return res.status(404).send({ status: false, message: "No product found for update" });
    } else {
      return res.status(200).send({ status: true, message: "Product updated successfully" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message:"Internal Server Error: " +err.message });
  }
};

const deleteProduct = async function (req, res) {
  try {
    let data = req.body;
    let { productId, reason } = data;

    // Check if productId and reason is provided
    if (!productId) {
      return res.status(400).send({ status: false, message: "Please provide Product Id" });
    }
    if (!reason) {
      return res.status(400).send({status: false, message: "Please provide reason for product cancellation." });
    }
    // Find the product by productId
    let productDetail = await productModel.findOne({_id:productId, isDeleted:false});
    
    if (!productDetail) {
      return res.status(404).send({ status: false, message: "Product not found" });
    }

    let productData = await productModel.updateOne(
      { _id: productId },
      { $set: { isDeleted: true, additionalInfo: reason } }
    );
   
    // Check if any product was updated
    if (productData.modifiedCount === 0) {
      return res.status(404).send({ status: false, message: "No product found for update" });
    } else {
     // Update the tracker model to reflect the product cancellation status
      await trackerModel.updateOne(
      { productId: productId },
      { $set: { status: "Cancled" } }
    );
      return res.status(200).send({ status: true, message: "Product Deleted successfully" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
