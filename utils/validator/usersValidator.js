const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../Models/usersModel");

exports.getUserByIdValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validatorMiddleware,
];

exports.deleteUserByIdValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email is already exists");
      }
    })
    .withMessage("Email address already exists"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Invalid role, must be either 'user' or 'admin'"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG","ar-SA"])
    .withMessage("Please provide a valid phone number only for Egypt and Saudi Arabia"),


  validatorMiddleware,
];

exports.updateUserByIdValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
