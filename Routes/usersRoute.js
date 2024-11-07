const express = require("express");

const {
  getUserByIdValidator,
  createUserValidator,
  deleteUserByIdValidator,
  updateUserByIdValidator,
} = require("../utils/validator/usersValidator");

const {
  getUsers,
  getUserById,
  createUser,
  editUser,
  deleteUserById,
  uploadUserImage,
  resizeImg,
} = require("../Services/userService");

const router = express.Router();

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
