const express = require("express");

const {
  getUserByIdValidator,
  createUserValidator,
  deleteUserByIdValidator,
  updateUserByIdValidator,
  updateUserPasswordValidator,
  updateMyDataValidator,
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
  updateMyPassword,
  updateMyData,
  userDisActivateAccount,
} = require("../Services/userService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router.use(AuthUser);
router.route("/getMy").get(getMy, getUserById);
router.route("/updateMyPassword").put(getMy, updateMyPassword);
router.route("/updateMyData").put(getMy, updateMyDataValidator, updateMyData);
router.route("/deleteMy").delete(getMy, userDisActivateAccount);

router
  .route("/updatePassword/:id")
  .put(updateUserPasswordValidator, updateUserPassword);

router
  .route("/")
  .get(allowedTO("manager", "admin"), getUsers)
  .post(
    allowedTO("manager", "admin"),
    uploadUserImage,
    createUserValidator,
    resizeImg,
    createUser
  );

router
  .route("/:id")
  .get(getUserByIdValidator, getUserById)
  .put(
    allowedTO("manager", "admin", "user"),
    uploadUserImage,
    updateUserByIdValidator,
    resizeImg,
    editUser
  )
  .delete(
    allowedTO("manager", "admin"),
    deleteUserByIdValidator,
    deleteUserById
  );

module.exports = router;
