const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require("slugify");
const brandModel = require("../../Models/brandModel");
const ApiError = require("../../utils/ApiError");

exports.getBrandByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
  validatorMiddleware,
];

exports.deleteBrandByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
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
      const existingBrand = await brandModel.findOne({ name: val });
      if (existingBrand) {
        throw new ApiError("Brand with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
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
      const existingBrand = await brandModel.findOne({ name: val });
      if (existingBrand) {
        throw new ApiError("Brand with this name already exists", 400);
      }
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
