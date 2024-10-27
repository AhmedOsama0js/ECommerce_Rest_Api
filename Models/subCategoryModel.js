const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "subCategory is required"],
      unique: [true, "subCategory most be unique"],
      minlength: [3, "subCategory most be bigger 3 character"],
      maxlength: [32, "subCategory most be smaller 3 character"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "subCategory most be belong to patent category"],
    },
    images: "string",
  },
  { timestamps: true }
);

const SbCategory =
  mongoose.models.subCategory ||
  mongoose.model("subCategory", subCategorySchema);

module.exports = SbCategory;

