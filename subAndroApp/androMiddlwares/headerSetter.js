const headerSetter = (req, res, next) => {
  req.andro = true;
  next();
};

module.exports = headerSetter;
