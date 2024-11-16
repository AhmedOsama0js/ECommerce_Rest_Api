const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const couponsModel = require("../Models/couponsModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");

const calcTotalPrice = (cart) => {
  let totalCartPrice = 0;
  cart.cartItems.forEach((item) => {
    totalCartPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalCartPrice;
  cart.totalCartPriceAfterDisCount = undefined;
  return totalCartPrice;
};

// POST
exports.createCart = asyncHandler(async (req, res) => {
  const { productId, color } = req.body;

  const product = await productModel.findById(productId);
  if (!product) {
    throw new ApiError("product not found ", 404);
  }

  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: { product: productId, color, price: product.price },
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId.toString() && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  calcTotalPrice(cart);
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "product add to cart successfully",
    data: cart,
  });
});

// GET
exports.getMyCart = asyncHandler(async (req, res) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(`there is no cart from this user ${req.user._id}`, 404);
  }

  res.status(200).json({
    status: "success",
    data: cart,
  });
});

// DELETE
exports.deleteCartItem = asyncHandler(async (req, res) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    { new: true }
  );

  calcTotalPrice(cart);
  await cart.save();

  res.status(204).send();
});

// DELETE ALL
exports.deleteAllCartUser = asyncHandler(async (req, res) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// PUT
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(`there is no cart from this user ${req.user._id}`, 404);
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === id.toString()
  );

  if (productIndex > -1) {
    cart.cartItems[productIndex].quantity = quantity;
  } else {
    throw new ApiError(`product not found`, 404);
  }

  calcTotalPrice(cart);
  await cart.save();

  res.status(201).json({ status: " success", message: "cart item updated" });
});

// PUT APPLY COUPON
exports.applyCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponsModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    throw new ApiError("Invalid coupon or expired", 400);
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError("there is no cart from this user", 404);
  }

  let totalPrice = calcTotalPrice(cart);

  const totalCartPriceAfterDisCount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalCartPriceAfterDisCount = totalCartPriceAfterDisCount;

  await cart.save();
  res
    .status(201)
    .json({ status: " success", message: "coupon applied", data: cart });
});
