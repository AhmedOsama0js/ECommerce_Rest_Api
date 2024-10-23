const express = require("express");
const router = express.Router();

const {
  getCategory,
  createCategory,
  getCategoryById,
  editCategory,
  deleteCategoryById
} = require("../Services/categoryService");

router.route("/").get(getCategory).post(createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .put(editCategory)
  .delete(deleteCategoryById);

module.exports = router;
