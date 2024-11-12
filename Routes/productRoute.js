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
  uploadProductsImages,
  resizeImg,
} = require("../Services/productService");


const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();



router
  .route("/")
  .get(getProducts)
  .post(
    AuthUser,
    allowedTO("manager", "admin"),
    uploadProductsImages,
    resizeImg,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductByIdValidator, getProductById)
  .put(
    AuthUser,
    allowedTO("manager", "admin"),
    uploadProductsImages,
    resizeImg,
    updateProductValidator,
    editProduct
  )
  .delete(
    AuthUser,
    allowedTO("manager", "admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
