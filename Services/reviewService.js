const reviewModel = require("../Models/reviewModel");
const factory = require("./FactoresApi/Factors");

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
