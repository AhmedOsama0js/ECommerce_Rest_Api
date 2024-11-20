const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Brand is required"],
      unique: [true, "Brand most be unique"],
      minlength: [3, "Brand most be bigger 3 character"],
      maxlength: [32, "Brand most be smaller 3 character"],
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
  if (doc.image && !doc.image.startsWith("http")) {
    const imageUrl = `${process.env.BASE_URL}/Brands/${doc.image}`;
    doc.image = imageUrl;
  }
}

brandSchema.post("init", updateImageUrl);
brandSchema.post("save", updateImageUrl);

const Brand = mongoose.models.brand || mongoose.model("brand", brandSchema);

module.exports = Brand;
