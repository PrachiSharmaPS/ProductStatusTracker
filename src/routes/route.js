const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const productController = require("../controller/productcontroller");
const trackingController = require("../controller/trackerController");
const {authenticate,authorization,adminAauthorization} = require("../middleware/auth");

//   User End Point
router.post("/register", userController.registerUser)
router.post("/login", userController.userLogin)

//   Product End Point
router.post("/createProduct",authenticate, productController.createProduct)
router.get("/getProducts",authenticate, productController.getProducts)
router.patch("/updateProduct",authenticate,authorization, productController.updateProduct)
router.delete("/deleteProduct",authenticate,authorization, productController.deleteProduct)

//   Tracking  Code  End Point
router.post("/createTrackingEvent",authenticate,adminAauthorization, trackingController.createTrackingEvent)
router.get("/getTrackingEvent", trackingController.getTrackingEvent)
router.get("/getFilterTrackingEvent",authenticate,adminAauthorization, trackingController.getFilterTrackingEvent)
router.patch("/updateTrackingEvent",authenticate,adminAauthorization, trackingController.updateTrackingEvent)
router.delete("/deleteTrackingEvent",authenticate,adminAauthorization, trackingController.deleteTrackingEvent)

router.all('/*', function(req,res){
    return res.status(400).send({message: "Invalid HTTPS Request"})
})


module.exports = router