function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({
      message: "Please check the highlighted fields and try again."
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "We couldn't submit your request right now. Please try again or contact us directly."
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: "We couldn't submit your request right now. Please try again or contact us directly."
  });
}

module.exports = errorHandler;
