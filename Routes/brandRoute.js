const express = require("express");

const {
  getBrandByIdValidator,
  createBrandValidator,
  deleteBrandByIdValidator,
  updateBrandByIdValidator,
} = require("../utils/validator/brandValidator");

const {
  getBrands,
  getBrandById,
  createBrand,
  editBrand,
  deleteBrandById,
  uploadBrandImage,
  resizeImg,
} = require("../Services/brandService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    AuthUser,
    allowedTO("manager", "admin"),
    uploadBrandImage,
    resizeImg,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandByIdValidator, getBrandById)
  .put(
    AuthUser,
    allowedTO("manager", "admin"),
    uploadBrandImage,
    resizeImg,
    updateBrandByIdValidator,
    editBrand
  )
  .delete(
    AuthUser,
    allowedTO("manager", "admin"),
    deleteBrandByIdValidator,
    deleteBrandById
  );

module.exports = router;
