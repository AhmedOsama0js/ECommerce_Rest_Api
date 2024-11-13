const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const userModel = require("../Models/usersModel");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const sendEmail = require("../utils/sendEmail");

exports.signupUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await userModel.create({
    name,
    email,
    password,
  });

  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
  console.log(user);
});

exports.AuthUser = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.header("Authorization") &&
    req.header("Authorization").startsWith("Bearer")
  ) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    throw new ApiError("you are not login, login first", 404);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new ApiError("Invalid token. Please login again.", 401);
  }

  const correctsUser = await userModel.findById(decoded.userId);

  if (!correctsUser) {
    throw new ApiError("user not found", 404);
  }

  if (correctsUser.passwordChangeAt) {
    const timeForSeconde = parseInt(
      correctsUser.passwordChangeAt.getTime() / 1000,
      10
    );
    if (timeForSeconde > decoded.iat) {
      throw new ApiError("password has been changed ,login again", 401);
    }
  }

  req.user = correctsUser;
  next();
});

exports.allowedTO = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError("you are not allowed to access this route", 403);
    }
    next();
  });

exports.forgotPasswordUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError(`user not found ${req.body.email}`, 404);
  }

  const restCode = Math.floor(100000 + Math.random() * 900000);

  const hashingCode = crypto
    .createHash("sha256")
    .update(restCode.toString())
    .digest("hex");

  user.resetPasswordCode = hashingCode;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  user.resetPasswordVerified = false;

  await user.save();

  const objectOption = {
    to: user.email,
    subject: "reset password",
    text: `your reset password code is ${restCode} `,
    html: `<p>your reset password code is ${restCode}</p>`,
  };

  try {
    await sendEmail(objectOption);
  } catch (err) {
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordVerified = undefined;
    await user.save();
    throw new ApiError("not sending rest Password to Email", 500);
  }

  res.status(200).json({
    status: "success",
    message: "reset password code has been sent to your email",
  });
});

exports.verifyRestCod = asyncHandler(async (req, res, next) => {
  const hashingCode = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordCode: hashingCode,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(`rest Code invalid or expired`, 404);
  }

  user.resetPasswordVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "rest code has been verified",
  });
});

exports.updateNewPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    throw new ApiError(`user not found email (${req.body.email}) `, 404);
  }

  if (!user.resetPasswordVerified) {
    throw new ApiError(" reset code not verified", 400);
  }

  user.password = req.body.newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordVerified = undefined;

  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ status: "success", token });
});
