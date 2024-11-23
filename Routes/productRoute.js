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

const reviewRout = require("./reviewRoute");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router();

router.use("/:productId/review", reviewRout);

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
    updateProductValidator,
    resizeImg,
    editProduct
  )
  .delete(
    AuthUser,
    allowedTO("manager", "admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
