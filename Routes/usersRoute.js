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
  getMy,
} = require("../Services/userService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router
  .route("/updatePassword/:id")
  .put(updateUserPasswordValidator, updateUserPassword);

router.route("/getMy").get(AuthUser, getMy, getUserById);

router
  .route("/")
  .get(AuthUser, allowedTO("manager", "admin"), getUsers)
  .post(
    AuthUser,
    allowedTO("manager", "admin"),
    uploadUserImage,
    resizeImg,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(getUserByIdValidator, getUserById)
  .put(
    AuthUser,
    allowedTO("manager", "admin", "user"),
    uploadUserImage,
    resizeImg,
    updateUserByIdValidator,
    editUser
  )
  .delete(
    AuthUser,
    allowedTO("manager", "admin"),
    deleteUserByIdValidator,
    deleteUserById
  );

module.exports = router;
