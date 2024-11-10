const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const userModel = require("../Models/usersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (payLode) =>
  jwt.sign({ userId: payLode }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_DATE,
  });

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

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

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
});
