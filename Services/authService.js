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
