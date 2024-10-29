const mongoose = require("mongoose");
const { Schema } = mongoose;
const categorySchema = new Schema(
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
    image: String,
  },
  { timestamps: true }
);

function updateImageUrl(doc) {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
}

categorySchema.post("init", updateImageUrl);
categorySchema.post("save", updateImageUrl);

const Category =
  mongoose.models.category || mongoose.model("category", categorySchema);

module.exports = Category;
