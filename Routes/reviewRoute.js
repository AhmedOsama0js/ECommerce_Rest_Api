const express = require("express");

const {
  getReviewByIdValidator,
  createReviewValidator,
  deleteReviewByIdValidator,
  updateReviewByIdValidator,
} = require("../utils/validator/reviewValidator");

const {
  getReviews,
  getReviewById,
  createReview,
  editReview,
  deleteReviewById,
  createFilterObj,
  setReviewToProductId,
  getUserFromReqUser,
} = require("../Services/reviewService");

const { AuthUser, allowedTO } = require("../Services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    AuthUser,
    allowedTO("user"),
    getUserFromReqUser,
    createReviewValidator,
    setReviewToProductId,
    createReview
  );

router
  .route("/:id")
  .get(getReviewByIdValidator, getReviewById)
  .put(
    AuthUser,
    allowedTO("user"),
    getUserFromReqUser,
    updateReviewByIdValidator,
    editReview
  )
  .delete(
    AuthUser,
    allowedTO("manager", "admin", "user"),
    deleteReviewByIdValidator,
    deleteReviewById
  );

module.exports = router;
