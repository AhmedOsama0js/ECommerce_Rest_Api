const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getSubCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID Format"),
  validatorMiddleware,
];

exports.deleteSubCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID Format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Name is too long, must be less than 32 characters"),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];

exports.updateSubCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID Format"),
  validatorMiddleware,
];
