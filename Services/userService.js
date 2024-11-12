const usersModel = require("../Models/usersModel");
const factory = require("./FactoresApi/Factors");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSignalImage } = require("../middleware/uploadImageMiddleware");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

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
exports.editUser = asyncHandler(async (req, res, next) => {
  const document = await usersModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
      image: req.body.image,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(
      new ApiError(`not found User by this id (${req.params.id})`, 404)
    );
  }
  const result = document.toObject();
  delete result.__v;
  res.status(200).json({ data: result });
});

// PUT User Password
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await usersModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangeAt: new Date(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(
      new ApiError(`not found User by this id (${req.params.id})`, 404)
    );
  }
  const result = document.toObject();
  delete result.__v;
  res.status(200).json({ data: result });
});

// DELETE
exports.deleteUserById = factory.deleteOne("user", usersModel);

// GET MY
exports.getMy = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// PUT PASS

exports.updateMyPassword = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangeAt: new Date(),
    },
    {
      new: true,
    }
  );

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// PUT DATA

exports.updateMyData = asyncHandler(async (req, res, next) => {
  const user = await usersModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: user });
});

// DELETE USER ACCOUNT
exports.userDisActivateAccount = asyncHandler(async (req, res, next) => {
  await usersModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "success" });
});
