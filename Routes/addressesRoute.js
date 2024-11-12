const express = require("express");

const {
  addAddress,
  deleteAddress,
  getAllAddress,
} = require("../Services/addressService");

const router = express.Router();
const { AuthUser, allowedTO } = require("../Services/authService");

router.use(AuthUser, allowedTO("user"));

router.route("/").post(addAddress).get(getAllAddress);

router.route("/:id").delete(deleteAddress);

module.exports = router;
