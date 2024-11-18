const categoryRouts = require("./CategoryRoute");
const subCategoryRouts = require("./subCategoryRoute");
const brandRouts = require("./brandRoute");
const productRouts = require("./productRoute");
const usersRouts = require("./usersRoute");
const authRouts = require("./authRoute");
const reviewRouts = require("./reviewRoute");
const wishlistRouts = require("./wishlistRoute");
const addAddressRouts = require("./addressesRoute");
const couponRoutes = require("./couponRoute");
const cartRoutes = require("./cartRoute");
const orderRoutes = require("./orderRoute");

const mountsRoutes = (app) => {
  app.use("/api/v1/category", categoryRouts);
  app.use("/api/v1/subCategory", subCategoryRouts);
  app.use("/api/v1/brand", brandRouts);
  app.use("/api/v1/product", productRouts);
  app.use("/api/v1/user", usersRouts);
  app.use("/api/v1/auth", authRouts);
  app.use("/api/v1/review", reviewRouts);
  app.use("/api/v1/wishlist", wishlistRouts);
  app.use("/api/v1/addresses", addAddressRouts);
  app.use("/api/v1/coupon", couponRoutes);
  app.use("/api/v1/cart", cartRoutes);
  app.use("/api/v1/order", orderRoutes);
};

module.exports = mountsRoutes;
