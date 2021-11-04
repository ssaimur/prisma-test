const db = require('../../dbcon');
const CustomError = require('../../errors/customError');
const bcrypt = require('bcrypt');
const asyncQueryWrapper = require('../../middlewares/commonMiddleware/asyncQueryWrapper');
const deleteFile = require('../../utils/fileRemover');

const controller = {};

// get single customer
controller.getSingleCustomer = (req, res, next) => {
  const { id } = req.params;

  const q = `SELECT * FROM customers WHERE id = ${id}`;
  db.query(q, (err, result) => {
    if (err) {
      next(new CustomError(err.message, 500, err.code));
    } else {
      res.status(200).json({ success: true, data: result[0] });
    }
  });
};

// update customer info
controller.updateCustomerInfo = (req, res, next) => {
  const { id } = req.params;
  const { name, address, phone, password } = req.body;
  const { filename } = req.file || {};

  db.query(
    `SELECT password FROM customers WHERE id = ${id}`,
    asyncQueryWrapper(
      async (err, result) => {
        if (err) {
          // delete file when a document fails to update
          deleteFile('customers', filename, (err) => {
            if (err) {
              console.log({ err });
            }
          });

          next(new CustomError(err.message, 500, err.code));
        } else if (result.length < 1) {
          // delete file when a document fails to update
          deleteFile('customers', filename, (err) => {
            if (err) {
              console.log({ err });
            }
          });

          next(new CustomError('Use does not exist!!', 400, 'Bad request'));
        } else {
          // check the password validity
          const isPassValid = await bcrypt.compare(
            password,
            result[0].password
          );

          if (isPassValid) {
            const q = `UPDATE customers SET ${name && `name = '${name}'`}, ${
              address && `address = '${address}'`
            }, ${filename && `photo = '${filename}'`}, ${
              phone && `phone = '${phone}'`
            } WHERE id = ${id}`;

            db.query(
              q.replace(/[']*(false|undefined)[']*[,]*/gi, ''),
              (err, result) => {
                if (err) {
                  next(new CustomError(err.message, 500, err.code));
                } else {
                  res.status(200).json({
                    success: true,
                    message: 'User successfully updated',
                  });
                }
              }
            );
          } else {
            // delete file when a document fails to update
            deleteFile('customers', filename, (err) => {
              if (err) {
                console.log({ err });
              }
            });

            next(
              new CustomError(
                'Password is incorrect!!',
                401,
                'Invalid Password'
              )
            );
          }
        }
      },
      { next, dirName: 'customers', filename }
    )
  );
};

module.exports = controller;
