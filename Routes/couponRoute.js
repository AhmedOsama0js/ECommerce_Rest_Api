const express = require("express");

// const {
//   getBrandByIdValidator,
//   createBrandValidator,
//   deleteBrandByIdValidator,
//   updateBrandByIdValidator,
// } = require("../utils/validator/brandValidator");

const {
  getCoupons,
  getCouponById,
  createCoupon,
  editCoupon,
  deleteCouponById,
} = require("../Services/couponsService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router
  .route("/")
  .get(AuthUser, allowedTO("manager", "admin"), getCoupons)
  .post(AuthUser, allowedTO("manager", "admin"), createCoupon);

router
  .route("/:id")
  .get(getCouponById)
  .put(AuthUser, allowedTO("manager", "admin"), editCoupon)
  .delete(AuthUser, allowedTO("manager", "admin"), deleteCouponById);

module.exports = router;
