const Joi = require("joi");

function notFoundHandler(req, res) {
  return res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} was not found.`,
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof Joi.ValidationError) {
    return res.status(400).json({
      message: "Validation failed.",
      details: error.details.map((detail) => detail.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource identifier." });
  }

  console.error(error);
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error.",
  });
}

module.exports = { errorHandler, notFoundHandler };
