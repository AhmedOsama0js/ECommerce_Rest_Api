const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.deleteAddressByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Address ID Format"),
  validatorMiddleware,
];

exports.createAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Alias is required")
    .isString()
    .withMessage("Alias must be a string"),

  check("details")
    .notEmpty()
    .withMessage("Details are required")
    .isString()
    .withMessage("Details must be a string"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Phone number must be a valid mobile phone number"),

  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Postal code must be valid"),

  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("alias")
    .optional()
    .notEmpty()
    .withMessage("Alias is required")
    .isString()
    .withMessage("Alias must be a string"),

  check("details")
    .optional()
    .notEmpty()
    .withMessage("Details are required")
    .isString()
    .withMessage("Details must be a string"),

  check("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Phone number must be a valid mobile phone number"),

  check("city")
    .optional()
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

  check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Postal code must be valid"),

  validatorMiddleware,
];
