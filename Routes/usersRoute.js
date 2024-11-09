const express = require("express");

const {
  getUserByIdValidator,
  createUserValidator,
  deleteUserByIdValidator,
  updateUserByIdValidator,
  updateUserPasswordValidator,
} = require("../utils/validator/usersValidator");

const {
  getUsers,
  getUserById,
  createUser,
  editUser,
  deleteUserById,
  uploadUserImage,
  resizeImg,
  updateUserPassword,
} = require("../Services/userService");

const router = express.Router();

router
  .route("/updatePassword/:id")
  .put(updateUserPasswordValidator, updateUserPassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImg, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserByIdValidator, getUserById)
  .put(uploadUserImage, resizeImg, updateUserByIdValidator, editUser)
  .delete(deleteUserByIdValidator, deleteUserById);

module.exports = router;
