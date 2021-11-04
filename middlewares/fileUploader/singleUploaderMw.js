const CustomError = require('../../errors/customError');
const uploader = require('../../utils/singleUploader');

const singleUploader = (folderPath) => {
  return (req, res, next) => {
    const upload = uploader(
      folderPath,
      ['image/jpeg', 'image/jpg', 'image/png'],
      'Only .jpg, jpeg or .png format allowed!'
    );

    // call the middleware function
    upload.single('photo')(req, res, (err) => {
      if (err) {
        next(new CustomError(err.message, 500, 'Upload failed'));
      } else {
        next();
      }
    });
  };
};

module.exports = singleUploader;
