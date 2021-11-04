const CustomError = require('../../errors/customError');
const deleteFile = require('../../utils/fileRemover');

const asyncWrapper = (cb, { dirName }) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      deleteFile(dirName, req.file.filename, (err) => {
        if (err) {
          console.log({ err });
        }
      });

      next(new CustomError(err.message, 500, { err }));
    }
  };
};

module.exports = asyncWrapper;
