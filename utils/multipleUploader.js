const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

const uploader = (subfolder_path, allowed_file_types, error_msg) => {
  const UPLOADS_FOLDER = `${__dirname}/../uploads/${subfolder_path}/`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

  // preapre the final multer upload object
  const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
};

module.exports = uploader;
