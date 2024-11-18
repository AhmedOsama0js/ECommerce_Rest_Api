const express = require("express");

const {
  createOrder,
  getAllOrder,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
  filterUser,
  createPaySession,
} = require("../Services/orderService");

const router = express.Router();

const { AuthUser, allowedTO } = require("../Services/authService");

router
  .route("/checkout-session/:cartId")
  .get(AuthUser, allowedTO("user"), createPaySession);

router.route("/:cartId").post(AuthUser, allowedTO("user"), createOrder);

router.route("/").get(AuthUser, filterUser, getAllOrder);

router.route("/:id").get(AuthUser, getOrderById);

router
  .route("/:id/pay")
  .put(AuthUser, allowedTO("admin", "manager"), updateOrderToPaid);

router
  .route("/:id/deliver")
  .put(AuthUser, allowedTO("admin", "manager"), updateOrderToDelivered);

module.exports = router;
