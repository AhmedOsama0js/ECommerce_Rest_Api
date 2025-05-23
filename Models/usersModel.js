const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      minlength: [3, "name most be bigger 3 character"],
      maxlength: [32, "name most be smaller 3 character"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      unique: [true, "email most be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password must be at least 8 characters"],
      // select: false,
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
    phone: String,
    image: String,
    passwordChangeAt: Date,
    resetPasswordCode: String,
    resetPasswordExpires: Date,
    resetPasswordVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

function updateImageUrl(doc) {
  if (doc.image && !doc.image.startsWith("http")) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.image}`;
    doc.image = imageUrl;
  }
}

userSchema.post("init", updateImageUrl);
userSchema.post("save", updateImageUrl);

const User = mongoose.models.user || mongoose.model("user", userSchema);

module.exports = User;
