const jwt = require("jsonwebtoken");

const createToken = (payLode) =>
  jwt.sign({ userId: payLode }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_DATE,
  });

module.exports = createToken;
