const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require("slugify");
const categoryModel = require("../../Models/categoryModel");
const ApiError = require("../../utils/ApiError");

exports.getCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];

exports.deleteCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Name is too long, must be less than 32 characters")
    .custom(async (val, { req }) => {
      const existingCategory = await categoryModel.findOne({ name: val });
      if (existingCategory) {
        throw new ApiError("Category with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Name is too long, must be less than 32 characters")
    .custom(async (val, { req }) => {
      const existingCategory = await categoryModel.findOne({ name: val });
      if (existingCategory) {
        throw new ApiError("Category with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
