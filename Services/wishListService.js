const usersModel = require("../Models/usersModel");
const asyncHandler = require("express-async-handler");

exports.addProductWithWishList = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product added successfully",
    data: user.wishlist,
  });
});

exports.deleteProductWithWishList = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.id },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product removed successfully",
    data: user.wishlist,
  });
});

exports.getAllProductWithWishList = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
