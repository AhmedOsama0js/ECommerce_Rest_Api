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
} = require("../Services/brandService");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandByIdValidator, getBrandById)
  .put(updateBrandByIdValidator, editBrand)
  .delete(deleteBrandByIdValidator, deleteBrandById);

module.exports = router;
