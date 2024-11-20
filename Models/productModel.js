const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "name most be require"],
      minlength: [3, "too short product name"],
      maxlength: [32, "product name too long"],
    },
    slug: {
      type: String,
      require: [true, "slug most be require"],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: [true, "description most be require"],
      minlength: [20, "description too short"],
      maxlength: [200, "description too long"],
    },
    quantity: {
      type: Number,
      require: [true, "quantity most be require"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "price most be require"],
      trim: true,
      max: [1000000, "price too high"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: {
      type: [String],
      require: [true, "colors most be require"],
    },
    coverImage: {
      type: String,
      require: [true, "coverImage most be require"],
    },
    images: {
      type: [String],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "category must be required"],
    },
    subCategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "brand",
    },
    ratingAverage: {
      type: Number,
      min: [1, "ratingAverage must be at least 1"],
      max: [5, "ratingAverage must be at most 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "category", select: "name" },
    { path: "subCategory", select: "name -category" },
    { path: "brand", select: "name" },
  ]);
  next();
});

function updateImageUrl(doc) {
  if (doc.coverImage && !doc.coverImage.startsWith("http")) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.coverImage}`;
    doc.coverImage = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      if (!image.startsWith("http")) {
        image = `${process.env.BASE_URL}/products/${image}`;
      }
      imagesList.push(image);
    });
    doc.images = imagesList;
  }
}

productSchema.post("init", updateImageUrl);
productSchema.post("save", updateImageUrl);

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

module.exports = Product;
