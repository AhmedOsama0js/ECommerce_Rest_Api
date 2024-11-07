const usersModel = require("../Models/usersModel");
const factory = require("./FactoresApi/Factors");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSignalImage } = require("../middleware/uploadImageMiddleware");

// upload image
exports.uploadUserImage = uploadSignalImage("image");

exports.resizeImg = asyncHandler(async (req, res, next) => {
  const fileName = `user-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(`uploads/users/${fileName}`);
    req.body.image = fileName;
  }
  next();
});

// GET
exports.getUsers = factory.getAllItems(usersModel);

//GET By ID
exports.getUserById = factory.getOneItem("user", usersModel);

// POST
exports.createUser = factory.createOne(usersModel);

// PUT
exports.editUser = factory.updateOne("user", usersModel);

// DELETE
exports.deleteUserById = factory.deleteOne("user", usersModel);
