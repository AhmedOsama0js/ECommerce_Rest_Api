const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    name: {
      type: "string",
      required: [true, "category is required"],
      unique: [true, "category most be unique"],
      minlength: [3, "category most be bigger 3 character"],
      maxlength: [32, "category most be smaller 3 character"],
    },
    slug: {
      type: "string",
      lowercase: true,
    },
    images: "string",
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
