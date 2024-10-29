const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const mongoose = require("mongoose");
const categoryModel = require("../../models/categoryModel");
const brandModel = require("../../models/brandModel");
const subCategoryModel = require("../../models/subCategoryModel");
const slugify = require("slugify");

exports.createProductValidator = [
 

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description is too short, must be at least 20 characters")
    .isLength({ max: 200 })
    .withMessage("Description is too long, must be less than 200 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0, max: 1000000 })
    .withMessage("Price must be a positive number and less than 1,000,000"),

  check("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discounted price must be a positive number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error(
          "Discounted price must be less than the original price"
        );
      }
      return true;
    }),

  check("colors")
    .isArray({ min: 1 })
    .withMessage("Colors must be an array with at least one color"),

  check("coverImage")
    .notEmpty()
    .withMessage("Cover image is required")
    .isString()
    .withMessage("Cover image must be a valid URL"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of URLs"),

  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID")
    .custom(async (categoryId) => {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error("Category does not exist");
      }
      return true;
    }),

  check("subCategory")
    .optional()
    .isArray()
    .withMessage("SubCategory must be an array of MongoDB IDs")
    .custom(async (subCategories, { req }) => {
      // تحقق من أن كل ID صالح
      if (!subCategories.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Each subCategory ID must be a valid MongoDB ID");
      }

      // تحقق من وجود كل ID في قاعدة البيانات
      const existingSubCategories = await subCategoryModel.find({
        _id: { $in: subCategories },
      });

      if (existingSubCategories.length !== subCategories.length) {
        throw new Error("One or more subCategory IDs do not exist");
      }

      // تحقق مما إذا كانت جميع IDs في subCategories هي جزء من subCategories الخاصة بالفئة المحددة
      const categorySubCategories = await subCategoryModel.find({
        category: req.body.category,
      });
      const subCategoriesIdDB = categorySubCategories.map((sub) =>
        sub._id.toString()
      );

      if (!subCategories.every((v) => subCategoriesIdDB.includes(v))) {
        throw new Error(
          "SubCategory must be a subset of the category's subCategories"
        );
      }

      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ID")
    .custom(async (brandId) => {
      const brand = await brandModel.findById(brandId);
      if (!brand) {
        throw new Error("brand does not exist");
      }
      return true;
    }),

  check("ratingAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1 and 5"),

  check("ratingQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rating quantity must be a non-negative integer"),

  validatorMiddleware,
];

exports.getProductByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
