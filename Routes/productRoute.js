const express = require("express");

const {
  getProductByIdValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../utils/validator/productValidator");

const {
  getProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProduct,
  uploadCategoryImage,
  resizeImg,
} = require("../Services/productService");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(uploadCategoryImage, resizeImg, createProductValidator, createProduct);

router
  .route("/:id")
  .get(getProductByIdValidator, getProductById)
  .put(updateProductValidator, editProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
