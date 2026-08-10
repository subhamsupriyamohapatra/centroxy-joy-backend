const { errorResponse } = require("../utils/apiResponse");

function errorHandler(err, req, res, next) {
  console.error("[Global Error Handler]", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [message];

  return errorResponse(res, statusCode, message, errors);
}

module.exports = errorHandler;
