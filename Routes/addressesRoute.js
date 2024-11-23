const express = require("express");

const {
  deleteAddressByIdValidator,
  createAddressValidator,
  updateAddressValidator,
} = require("../utils/validator/addressValidator");

const {
  addAddress,
  deleteAddress,
  getAllAddress,
  updateAddressData,
} = require("../Services/addressService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router.use(AuthUser, allowedTO("user"));

router.route("/").post(createAddressValidator, addAddress).get(getAllAddress);

router
  .route("/:id")
  .delete(deleteAddressByIdValidator, deleteAddress)
  .put(updateAddressValidator, updateAddressData);

module.exports = router;
