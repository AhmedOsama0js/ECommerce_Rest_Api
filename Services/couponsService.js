const couponModel = require("../Models/couponsModel");
const factory = require("./FactoresApi/Factors");

// GET
exports.getCoupons = factory.getAllItems(couponModel);

//GET By ID
exports.getCouponById = factory.getOneItem("coupon", couponModel);
// POST
exports.createCoupon = factory.createOne(couponModel);

// PUT
exports.editCoupon = factory.updateOne("coupon", couponModel);

// DELETE
exports.deleteCouponById = factory.deleteOne("coupon", couponModel);
