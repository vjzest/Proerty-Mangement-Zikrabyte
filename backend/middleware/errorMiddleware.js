const globalErrorHandler = (err, req, res) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: "fail",
      message: `${field} already exists`,
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      status: "fail",
      message: messages.join(". "),
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Token expired",
    });
  }

  res.status(500).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
};

module.exports = globalErrorHandler;
