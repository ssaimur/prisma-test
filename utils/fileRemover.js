const fs = require('fs');

const deleteFile = (dir, files, callback) => {
  if (typeof files === 'string') {
    const strPath = `${__dirname}/../uploads/${dir}/${files}`;

    fs.unlink(strPath, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(false);
      }
    });
  } else if (files.length < 1) {
    return;
  } else {
    const arrPath1 = `${__dirname}/../uploads/${dir}/${files[0]}`;

    fs.unlink(arrPath1, (err) => {
      if (err) {
        callback(err);
      } else {
        const arrPath1 = `${__dirname}/../uploads/${dir}/${files[1]}`;

        files[1] !== undefined &&
          fs.unlink(arrPath1, (err) => {
            if (err) {
              callback(err);
            } else {
              callback(false);
            }
          });
      }
    });
  }
};

module.exports = deleteFile;
