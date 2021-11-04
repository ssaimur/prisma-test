const CustomError = require('../../errors/customError');
const uploader = require('../../utils/multipleUploader');

const multipleUploader = (folderPath) => {
  return (req, res, next) => {
    const upload = uploader(
      folderPath,
      ['image/jpeg', 'image/jpg', 'image/png'],
      'Only .jpg, jpeg or .png format allowed!'
    );

    // call the middleware function
    upload.any()(req, res, (err) => {
      if (err) {
        next(new CustomError(err.message, 500, 'Unknown'));
      } else {
        next();
      }
    });
  };
};

module.exports = multipleUploader;
