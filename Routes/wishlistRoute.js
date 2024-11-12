const express = require("express");

const {
  addProductWithWishList,
  deleteProductWithWishList,
  getAllProductWithWishList,
} = require("../Services/wishListService");

const router = express.Router();
const { AuthUser, allowedTO } = require("../Services/authService");

router.use(AuthUser, allowedTO("user"));

router.route("/").post(addProductWithWishList).get(getAllProductWithWishList);

router.route("/:id").delete(deleteProductWithWishList);

module.exports = router;
