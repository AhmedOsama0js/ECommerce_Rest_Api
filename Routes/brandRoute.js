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

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeImg, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandByIdValidator, getBrandById)
  .put(uploadBrandImage, resizeImg, updateBrandByIdValidator, editBrand)
  .delete(deleteBrandByIdValidator, deleteBrandById);

module.exports = router;
