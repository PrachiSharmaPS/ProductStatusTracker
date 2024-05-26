const mongoose = require('mongoose')

//=========================// isValidEmail //===================================

const isValidEmail = function (value) {
  let emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) return true;
};

//============================// idCharacterValid //============================

const isValidObjectId = function (objectId) {
  var valid = mongoose.Types.ObjectId.isValid(objectId)
  if (!valid) { return false }
  else { return true }
}

//==============================// isValidName //================================

const isValidName = function (name) {

  if (name.trim().length === 0) { return false }
  if (/^[a-zA-Z ,.'-]+$/.test(name)) {
    return true;
  }
  return false
};

//==============================// isValidNumber //===============================

const isValidNumber = function (number) {
  // Regular expression to check if the input consists only of digits
  if (/^\d+$/.test(number)) {
    return true;
  }
  return false;
}
//==============================// isValiprice //===============================
const isValidPrice = function (number) {
  if (/^\d+(\.\d+)?$/.test(number)) {
    return true;
  }
  return false;
}
//==============================// isValidPassword //===============================

const isValidPassword = function (pwd) {
  let passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
  if (passwordRegex.test(pwd)) {
    return true;
  } else {
    return false;
  }
}



//=============================// module exports //==============================

module.exports = {isValidEmail, isValidObjectId,isValidPrice, isValidPassword, isValidName, isValidNumber }