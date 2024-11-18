const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: [true, "user is required"],
    },
    cartItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "product" },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    shoppingAddress: {
      details: String,
      city: String,
      phone: String,
      postCode: String,
    },
    taxPrice: { type: Number, default: 0 },
    shoppingPrice: { type: Number, default: 0 },

    totalOrderPrice: { type: Number },

    PaymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    pidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliverAt: Date,
  },
  { timestamps: true }
);



orderSchema.pre(/find/, function (next) {
  this.populate({
    path: "user",
    select: "name image email phone",
  }).populate({
    path: "cartItems.product",
    select: "name coverImage price",
  });
  next();
});

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

module.exports = Order;
