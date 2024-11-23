const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const productModel = require("../../Models/productModel");
const ApiError = require("../../utils/ApiError");


exports.deleteWishlistByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Wishlist ID Format"),
  validatorMiddleware,
];

exports.createWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID")
    .custom(async (productId) => {
      const existingProduct = await productModel.findById(productId);
      if (!existingProduct) {
        throw new ApiError("Product not found", 400);
      }
      return true;
    }),
  validatorMiddleware,
];

