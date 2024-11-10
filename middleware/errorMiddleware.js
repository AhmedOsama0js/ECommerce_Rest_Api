const ApiError = require("../utils/ApiError");

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_MODE === "develop") {
    return sendErrorForDev(err, res);
  } else {
    return sendErrorForPro(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorForPro = (err, res) => {
  if (err.name === "JsonWebTokenError")
    err = new ApiError("invalid token login again", 401);

  if (err.name === "TokenExpiredError")
    err = new ApiError("token is Expired login again", 401);

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
