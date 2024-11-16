const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon is required"],
      unique: [true, "Coupon most be unique"],
      minlength: [3, "Coupon most be bigger 3 character"],
      maxlength: [20, "Coupon most be smaller 20 character"],
      unique: [true, "Coupon most be unique"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
      
    }
  },
  { timestamps: true }
);

const Coupon = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

module.exports = Coupon;
