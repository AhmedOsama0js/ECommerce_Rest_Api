const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    name: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, " rating value is 1.0"],
      max: [5, "rating value is 5.0"],
      required: [true, "ratings is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: [true, "product is required"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/find/, function (next) {
  this.populate({
    path: "user",
    select: "name image",
  });
  next();
});

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);

module.exports = Review;