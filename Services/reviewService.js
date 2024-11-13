const reviewModel = require("../Models/reviewModel");
const factory = require("./FactoresApi/Factors");

exports.setSubcategoryToCategoryId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
};

// GET
exports.getReviews = factory.getAllItems(reviewModel);

//GET By ID
exports.getReviewById = factory.getOneItem("review", reviewModel);
// POST
exports.createReview = factory.createOne(reviewModel);

// PUT
exports.editReview = factory.updateOne("review", reviewModel);

// DELETE
exports.deleteReviewById = factory.deleteOne("review", reviewModel);
