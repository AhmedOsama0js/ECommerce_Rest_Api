const express = require("express");

// const subCategoryRoute = require("./subCategoryRoute")
const {
  getCategoryByIdValidator,
  createCategoryValidator,
  deleteCategoryByIdValidator,
  updateCategoryByIdValidator,
} = require("../utils/validator/categoryValidator");

const {
  getCategory,
  createCategory,
  getCategoryById,
  editCategory,
  deleteCategoryById,
} = require("../Services/categoryService");

const router = express.Router();

// router.use("/:categoryId/subCategory", subCategoryRoute);

router
  .route("/")
  .get(getCategory)
  .post(createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryByIdValidator, getCategoryById)
  .put(updateCategoryByIdValidator, editCategory)
  .delete(deleteCategoryByIdValidator, deleteCategoryById);

module.exports = router;
