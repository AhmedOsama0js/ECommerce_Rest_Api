const express = require("express");

const {
  signupUserValidator,
  loginUserValidator,
} = require("../utils/validator/authValidator");

const {
  signupUser,
  loginUser,
  forgotPasswordUser,
  verifyRestCod,
  updateNewPassword,
} = require("../Services/authService");

const router = express.Router();

router.route("/signup").post(signupUserValidator, signupUser);
router.route("/login").post(loginUserValidator, loginUser);
router.route("/forgotPassword").post(forgotPasswordUser);
router.route("/verifyRestCode").post(verifyRestCod);
router.route("/updatePassword").post(updateNewPassword);

// router
//   .route("/:id")
//   .get(getUserByIdValidator, getUserById)
//   .put(uploadUserImage, resizeImg, updateUserByIdValidator, editUser)
//   .delete(deleteUserByIdValidator, deleteUserById);

module.exports = router;
