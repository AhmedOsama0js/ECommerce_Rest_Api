const express = require("express");

// const {
//   getBrandByIdValidator,
//   createBrandValidator,
//   deleteBrandByIdValidator,
//   updateBrandByIdValidator,
// } = require("../utils/validator/brandValidator");

const {
  createCart,
  getMyCart,
  deleteCartItem,
  deleteAllCartUser,
  updateCartItem,
  applyCoupon,
} = require("../Services/cartService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router.use(AuthUser, allowedTO("user"));

router.route("/applyCoupon").put(applyCoupon);

router.route("/").post(createCart).get(getMyCart).delete(deleteAllCartUser);

router.route("/:id").put(updateCartItem).delete(deleteCartItem);

module.exports = router;
