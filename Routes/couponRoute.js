const express = require("express");

const {
  getCouponByIdValidator,
  createCouponValidator,
  updateCouponByIdValidator,
  deleteCouponByIdValidator,
} = require("../utils/validator/couponValidator");

const {
  getCoupons,
  getCouponById,
  createCoupon,
  editCoupon,
  deleteCouponById,
} = require("../Services/couponsService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router.route("/:id").get(getCouponByIdValidator, getCouponById);

router.use(AuthUser, allowedTO("manager", "admin"));

router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);
router
  .route("/:id")
  .put(updateCouponByIdValidator, editCoupon)
  .delete(deleteCouponByIdValidator, deleteCouponById);

module.exports = router;
