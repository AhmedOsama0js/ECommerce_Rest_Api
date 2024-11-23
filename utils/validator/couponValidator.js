const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require("slugify");
const ApiError = require("../../utils/ApiError");
const couponsModel = require("../../Models/couponsModel");


exports.getCouponByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon ID Format"),
  validatorMiddleware,
];

exports.deleteCouponByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon ID Format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("Name is too long, must be less than 20 characters")
    .custom(async (val, { req }) => {
      const existingCoupon = await couponsModel.findOne({ name: val });
      if (existingCoupon) {
        throw new ApiError("Coupon with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check("expire")
    .notEmpty()
    .withMessage("Expire date is required")
    .isDate()
    .withMessage("The value must be a valid date")
    .custom((value) => {
      const currentDate = new Date();
      const inputDate = new Date(value);
      if (inputDate <= currentDate) {
        throw new Error("The date must be in the future");
      }
      return true;
    }),

  check("discount")
    .notEmpty()
    .withMessage("Discount is required")
    .isNumeric()
    .withMessage("The value must be a number")
    .isInt({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),

  validatorMiddleware,
];

exports.updateCouponByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon ID Format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("Name is too long, must be less than 20 characters")
    .custom(async (val, { req }) => {
      const existingCoupon = await couponsModel.findOne({ name: val });
      if (existingCoupon) {
        throw new ApiError("Coupon with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check("expire")
    .optional()
    .notEmpty()
    .withMessage("Expire date is required")
    .isDate()
    .withMessage("The value must be a valid date")
    .custom((value) => {
      const currentDate = new Date();
      const inputDate = new Date(value);
      if (inputDate <= currentDate) {
        throw new Error("The date must be in the future");
      }
      return true;
    }),

  check("discount")
    .optional()
    .notEmpty()
    .withMessage("Discount is required")
    .isNumeric()
    .withMessage("The value must be a number")
    .isInt({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),

  validatorMiddleware,
];
