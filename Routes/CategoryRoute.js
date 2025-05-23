const express = require("express");

const subCategoryRoute = require("./subCategoryRoute");
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
  uploadCategoryImage,
  resizeImg,
} = require("../Services/categoryService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router.use("/:categoryId/subcategory", subCategoryRoute);

router
  .route("/")
  .get(getCategory)
  .post(
    AuthUser,
    allowedTO("manager", "admin"),
    uploadCategoryImage,
    createCategoryValidator,
    resizeImg,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryByIdValidator, getCategoryById)
  .put(
    AuthUser,
    allowedTO("manager", "admin"),
    uploadCategoryImage,
    updateCategoryByIdValidator,
    resizeImg,
    editCategory
  )
  .delete(
    AuthUser,
    allowedTO("manager", "admin"),
    deleteCategoryByIdValidator,
    deleteCategoryById
  );

module.exports = router;
