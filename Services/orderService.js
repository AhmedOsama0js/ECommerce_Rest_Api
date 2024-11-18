const orderModel = require("../Models/orderModel");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const factory = require("./FactoresApi/Factors");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

exports.filterUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObject = { user: req.user._id };
  next();
});

// POST
exports.createOrder = asyncHandler(async (req, res, next) => {
  let shoppingPrice = 0;
  let taxPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);
  console.log(req.params.cartId);

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  const cartPrice = cart.totalCartPriceAfterDisCount
    ? cart.totalCartPriceAfterDisCount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + shoppingPrice + taxPrice;

  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    cart: req.body.cartId,
    shoppingAddress: req.body.shoppingAddress,
    totalOrderPrice,
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await productModel.bulkWrite(bulkOption, {});

    await cartModel.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

// GET
exports.getAllOrder = factory.getAllItems(orderModel);

// GET BY ID
exports.getOrderById = factory.getOneItem("order", orderModel);

// PUT
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  order.paymentStatus = true;
  order.pidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(201).json({ status: " success", data: updatedOrder });
});

// PUT
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  order.isDelivered = true;
  order.deliverAt = Date.now();
  const updatedOrder = await order.save();

  res.status(201).json({ status: " success", data: updatedOrder });
});

// createPaySession
exports.createPaySession = asyncHandler(async (req, res, next) => {
  let shoppingPrice = 0;
  let taxPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }
  console.log(cart._id.toString());
  
  const cartPrice = cart.totalCartPriceAfterDisCount
    ? cart.totalCartPriceAfterDisCount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + shoppingPrice + taxPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp", // العملة
          product_data: {
            name: req.user.name, // اسم المنتج أو المستخدم
          },
          unit_amount: totalOrderPrice * 100, // السعر بالعملة الصغيرة (مثل القرش للمصري)
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.host}/orders`,
    cancel_url: `${req.protocol}://${req.host}/cart`,

    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
    metadata: req.body.shoppingAddress,
  });

  res.status(200).json({ status: "success", session });
});
