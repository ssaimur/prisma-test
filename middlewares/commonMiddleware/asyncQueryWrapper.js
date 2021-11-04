const CustomError = require('../../errors/customError');
const deleteFile = require('../../utils/fileRemover');

const asyncQueryWrapper = (cb, { next, dirName, filename }) => {
  return async (error, result, fields) => {
    try {
      await cb(error, result, fields);
    } catch (err) {
      // delete file
      dirName &&
        filename &&
        deleteFile(dirName, filename, (err) => {
          if (err) {
            console.log({ err });
          }
        });

      next(new CustomError(err.message, 500, 'Internal server error!!'));
    }
  };
};

module.exports = asyncQueryWrapper;
