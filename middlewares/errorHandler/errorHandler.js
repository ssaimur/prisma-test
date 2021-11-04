const errorHandler = (err, req, res, next) => {
  const customError = {
    success: false,
  };

  customError.message = err.message;
  customError.status = err.status;
  customError.type = err.type;

  res.status(customError.status || 500).json(customError);
};

module.exports = errorHandler;
