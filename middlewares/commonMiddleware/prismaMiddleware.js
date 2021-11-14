const prismaHelper = (req, res, next) => {
  const body = req.body;
  console.log({ body });
  next();
};

module.exports = prismaHelper;
