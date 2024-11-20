const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require("slugify");
const categoryModel = require("../../Models/categoryModel");
const subCategoryModel = require("../../Models/subCategoryModel");
const ApiError = require("../../utils/ApiError");

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
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Name is too long, must be less than 32 characters")
    .custom(async (val, { req }) => {
      const existingSubcategory = await subCategoryModel.findOne({ name: val });
      if (existingSubcategory) {
        throw new ApiError("Subcategory with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Invalid Category ID Format")
    .custom(async (categoryId) => {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error("Category does not exist");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateSubCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID Format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name is too short, must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Name is too long, must be less than 32 characters")
    .custom(async (val, { req }) => {
      const existingSubcategory = await subCategoryModel.findOne({ name: val });
      if (existingSubcategory) {
        throw new ApiError("Subcategory with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check("category")
    .optional()
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Invalid Category ID Format")
    .custom(async (categoryId) => {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error("Category does not exist");
      }
      return true;
    }),

  validatorMiddleware,
];
