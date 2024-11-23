const mongoose = require("mongoose");
const { Schema } = mongoose;
const productModel = require("./productModel");

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
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

reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await productModel.findOneAndUpdate(productId, {
      ratingAverage: result[0].avgRating,
      ratingQuantity: result[0].ratingQuantity,
    });
  } else {
    await productModel.findOneAndUpdate(productId, {
      ratingAverage: 0,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingAndQuantity(this.product);
});


reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingAndQuantity(this.product);
});

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);

module.exports = Review;
