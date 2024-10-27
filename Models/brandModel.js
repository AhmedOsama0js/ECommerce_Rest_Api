const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category is required"],
      unique: [true, "category most be unique"],
      minlength: [3, "category most be bigger 3 character"],
      maxlength: [32, "category most be smaller 3 character"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    images: String,
  },
  { timestamps: true }
);

const Brand = mongoose.models.brand || mongoose.model("brand", brandSchema);

module.exports = Brand;
