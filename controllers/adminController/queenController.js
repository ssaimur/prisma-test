const bcrypt = require('bcrypt');
const db = require('../../dbcon');
const CustomError = require('../../errors/customError');
const asyncQueryWrapper = require('../../middlewares/commonMiddleware/asyncQueryWrapper');
const deleteFile = require('../../utils/fileRemover');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const controller = {};

// fetch a queen
controller.getAQueen = async (req, res, next) => {
  const { phone } = req.params;

  // const q = `SELECT * FROM admin_queens WHERE phone = ${phone}`;
  // db.query(q, (err, result) => {
  //   if (err) {
  //     next(new CustomError(err.message, 400, err.code));
  //   } else {
  //     res.status(200).json({ sucess: true, data: result[0] });
  //   }
  // });

  const queen = await prisma.admin_queens.findFirst({
    where: {
      phone,
    },
  });

  res.status(200).json({ sucess: true, data: queen });
};

// upload queens NIDs
controller.uploadNid = (req, res, next) => {
  const { phone } = req.params;
  const nid_front = req.files.nid_front[0].filename;
  const nid_back = req.files.nid_back[0].filename;

  const files = [];

  [nid_front, nid_back].map((item) => item !== undefined && files.push(item));

  const q = `UPDATE admin_queens SET nid_front='${nid_front}', nid_back='${nid_back}' WHERE phone='${phone}'`;
  db.query(q, (err) => {
    if (err) {
      deleteFile('nids', files, (err) => {
        if (err) {
          console.log({ err });
        }
      });

      next(new CustomError(err.message, 500, err.code));
    } else {
      res.json({ success: true, message: 'NID upload successful' });
    }
  });
};

// update queen's info
controller.queenUpdateInfo = (req, res, next) => {
  const { phone } = req.params;
  const { name, address } = req.body;

  const q = `UPDATE admin_queens SET name='${name}', address ='${address}' WHERE phone = '${phone}'`;
  db.query(q, (err, result) => {
    if (err) {
      next(new CustomError(err.message, 500, err.code));
    } else {
      res.status(200).json({ success: true, data: result });
    }
  });
};

// update queen's Bank
controller.queenUpdateBank = (req, res, next) => {
  const { phone } = req.params;
  const { bank_name, account_number } = req.body;
  const q = `UPDATE admin_queens SET bank_name ='${bank_name}', account_number ='${account_number}' WHERE phone = '${phone}'`;
  db.query(q, (err, result) => {
    if (err) {
      next(new CustomError(err.message, 500, err.code));
    } else {
      res.status(200).json({ success: true, data: result });
    }
  });
};

// update queens dp
controller.queenUpdateDp = (req, res, next) => {
  const { phone } = req.params;
  const { filename } = req.file;

  const q = `UPDATE admin_queens SET photo='${filename}' WHERE phone='${phone}'`;
  db.query(q, (err, result) => {
    if (err) {
      deleteFile('queens', filename, (err) => {
        if (err) {
          console.log({ err });
        }
      });
      next(new CustomError(err.message, 500, err.code));
    } else {
      res.status(200).json({ success: true, data: result, filename });
    }
  });
};

// update queens password
controller.queenUpdatePassword = (req, res, next) => {
  const { phone } = req.params;
  const { old_password, new_password } = req.body;

  const q = `SELECT password FROM admin_queens WHERE phone='${phone}'`;
  db.query(
    q,
    asyncQueryWrapper(
      async (err, result) => {
        if (err) {
          next(new CustomError(err.message, 500, err.code));
        } else {
          const { password } = result[0];
          const isPasswordValid = await bcrypt.compare(old_password, password);

          if (isPasswordValid) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);

            const q = `UPDATE admin_queens set password='${hashedPassword}' WHERE phone='${phone}'`;
            db.query(q, (err, result) => {
              if (err) {
                next(new CustomError(err.message, 500, err.code));
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Your password is changed successfully',
                });
              }
            });
          }
        }
      },
      { next }
    )
  );
};

module.exports = controller;
