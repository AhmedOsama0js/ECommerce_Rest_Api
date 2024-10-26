const express = require("express");

const {
  createSubCategoryValidator,
  getSubCategoryByIdValidator,
  deleteSubCategoryByIdValidator,
  updateSubCategoryByIdValidator,
} = require("../utils/validator/subCategoryValidator");

const {
  createSubCategory,
  getSubCategory,
  getSubCategoryById,
  deleteSubCategoryById,
  editSubCategory,
} = require("../Services/subCategoryService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getSubCategory)
  .post(createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryByIdValidator, getSubCategoryById)
  .delete(deleteSubCategoryByIdValidator, deleteSubCategoryById)
  .put(updateSubCategoryByIdValidator, editSubCategory);

module.exports = router;
