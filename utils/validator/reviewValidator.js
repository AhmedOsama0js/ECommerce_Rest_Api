const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const reviewModel = require("../../Models/reviewModel");
const productModel = require("../../Models/productModel");
const userModel = require("../../Models/usersModel");

exports.getReviewByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID Format"),
  validatorMiddleware,
];

exports.deleteReviewByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom(async (val, { req }) => {
      const review = await reviewModel.findById(val);

      if (!review) {
        throw new Error(`there is not review with id ${val}`);
      }

      if (req.user === "user") {
        if (review.user.toString() !== req.user._id.toString()) {
          throw new Error("You are not the owner of this review");
        }
      }

      return true;
    }),

  validatorMiddleware,
];

exports.createReviewValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Name is too long, must be less than 32 characters"),

  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 and 5"),

  check("user")
    .isMongoId()
    .withMessage("Invalid User ID Format")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(val);
      if (!user) {
        throw new Error(" User not found");
      }
      return true;
    }),

  check("product")
    .isMongoId()
    .withMessage("Invalid Product ID Format")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new Error(" product not found");
      }

      const review = await reviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new Error("You have already reviewed this product");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateReviewByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom(async (val, { req }) => {
      const review = await reviewModel.findById(val);
      if (!review) {
        throw new Error(`there is not review with id ${val}`);
      }
      if (review.user.toString() !== req.user._id.toString()) {
        throw new Error("You are not the owner of this review");
      }
      return true;
    }),

  validatorMiddleware,
];
