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
  createFilterObj,
  setSubcategoryToCategoryId,
} = require("../Services/subCategoryService");

const { AuthUser, allowedTO } = require("../Services/authService");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getSubCategory)
  .post(
    AuthUser,
    allowedTO("manager", "admin"),
    setSubcategoryToCategoryId,
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
