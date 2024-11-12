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
  deleteSubCategory,
  editSubCategory,
} = require("../Services/subCategoryService");

const { AuthUser, allowedTO } = require("../Services/authService");
const router = express.Router();

router
  .route("/")
  .get(getSubCategory)
  .post(
    AuthUser,
    allowedTO("manager", "admin"),
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryByIdValidator, getSubCategoryById)
  .delete(
    AuthUser,
    allowedTO("manager", "admin"),
    deleteSubCategoryByIdValidator,
    deleteSubCategory
  )
  .put(
    AuthUser,
    allowedTO("manager", "admin"),
    updateSubCategoryByIdValidator,
    editSubCategory
  );

module.exports = router;
