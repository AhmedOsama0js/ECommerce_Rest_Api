const usersModel = require("../Models/usersModel");
const asyncHandler = require("express-async-handler");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address added successfully",
    data: user.addresses,
  });
});

exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses:{ _id:req.params.id} },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "addresses removed successfully",
    data: user.addresses,
  });
});

exports.getAllAddress = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
