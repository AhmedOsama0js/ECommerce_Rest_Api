// Define a class for errors (ApiError),
// used to return custom error messages with HTTP status and status code.
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith(4) ? "fail" : "error";
  }
}

module.exports = ApiError;
