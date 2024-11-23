const express = require("express");

const {
  deleteWishlistByIdValidator,
  createWishlistValidator,
} = require("../utils/validator/wishlistValidator");

const {
  addProductWithWishList,
  deleteProductWithWishList,
  getAllProductWithWishList,
} = require("../Services/wishListService");

const router = express.Router();
const { AuthUser, allowedTO } = require("../Services/authService");

router.use(AuthUser, allowedTO("user"));

router
  .route("/")
  .post(createWishlistValidator, addProductWithWishList)
  .get(getAllProductWithWishList);

router
  .route("/:id")
  .delete(deleteWishlistByIdValidator, deleteProductWithWishList);

module.exports = router;
