const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      const statusCode = error.statusCode || error.status || 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        reqestObject: req,
      });
    }
  };
};

export default asyncHandler;
