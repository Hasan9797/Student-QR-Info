import crypto from "crypto";

const ERROR_CODES = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "INTERNAL_SERVER_ERROR",
};

const errorHandler = (err, req, res, next) => {
  console.error("Global error handler:", err);

  const statusCode = err.code && typeof err.code === "number" ? err.code : 500;
  const errorCode = ERROR_CODES[statusCode] || "INTERNAL_SERVER_ERROR";

  const body = {
    success: false,
    message: err.message || "Internal server error",
    error: {
      code: errorCode,
      statusCode,
    },
  };

  if (statusCode === 500) {
    body.error.requestId = `req_${crypto.randomBytes(6).toString("hex")}`;
  }

  res.status(statusCode).json(body);
};

export default errorHandler;
