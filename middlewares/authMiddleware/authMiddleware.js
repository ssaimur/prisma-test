const jwt = require('jsonwebtoken');
const CustomError = require('../../errors/customError');

const checkAuth = (cookieName) => {
  return (req, _res, next) => {
    const token = req.cookies[cookieName] || req.headers[cookieName];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
          next(
            new CustomError('User not authorized!!', 401, 'Unauthorized Token')
          );
        } else {
          next();
        }
      });
    } else {
      next(
        new CustomError(
          'User not authorized!!',
          401,
          'Token Expired or Token empty'
        )
      );
    }
  };
};

module.exports = checkAuth;
