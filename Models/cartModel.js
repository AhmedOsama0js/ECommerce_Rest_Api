const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartModel = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    cartItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalCartPriceAfterDisCount: Number,
  },
  { timestamps: true }
);

const Cart = mongoose.models.cart || mongoose.model("cart", cartModel);

module.exports = Cart;
