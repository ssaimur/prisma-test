const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../dbcon');
const CustomError = require('../../errors/customError');
const asyncWrapper = require('../../middlewares/commonMiddleware/assyncWrapper');
const asyncQueryWrapper = require('../../middlewares/commonMiddleware/asyncQueryWrapper');
const deleteFile = require('../../utils/fileRemover');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const maxAge = 30 * 24 * 60 * 60;

const createToken = (creds) => {
  return jwt.sign(creds, process.env.JWT_SECRET, { expiresIn: maxAge });
};

// module scaffolding
const authControllers = {};

/////////////////////////////////////////////////////////////
// Register a user (queen/customer)
////////////////////////////////////////////////////////////
authControllers.register = (table) => {
  return asyncWrapper(
    async (req, res, next) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const { name, phone, address, bank_name, account_number } = req.body;
      const { filename } = req.file;

      const setBank =
        table === 'admin_queens' ? { account_number, bank_name } : {};

      const getBank =
        table === 'admin_queens'
          ? { account_number: true, bank_name: true }
          : {};

      console.log({ table });

      const user = await prisma[table].create({
        data: {
          name,
          phone,
          password: hashedPassword,
          photo: filename,
          address,
          ...setBank,
        },
        select: {
          name: true,
          phone: true,
          photo: true,
          address: true,
          ...getBank,
        },
      });
      res.status(200).json({ user });

      // const q = `INSERT INTO ${table} (name, phone, password, photo, ${
      //   table === 'admin_queens' && 'bank_name'
      // }, ${
      //   table === 'admin_queens' && 'account_number'
      // }, address) VALUES ( '${name}', '${phone}', '${hashedPassword}', '${filename}', '${
      //   table === 'admin_queens' && bank_name
      // }', '${table === 'admin_queens' && account_number}', '${address}' )`;

      // const filteredQ = q.replace(/[']*(false|undefined)[']*[,]*/gi, '');

      // db.query(filteredQ, (err) => {
      //   if (err) {
      //     // delete file when a document fails to update
      //     deleteFile(
      //       table === 'admin_queens' ? 'queens' : 'customers',
      //       filename,
      //       (err) => {
      //         if (err) {
      //           console.log({ err });
      //         }
      //       }
      //     );

      //     next(new CustomError(err.message, 500, err.code));
      //   } else {
      //     const token = createToken({ name, phone, address });

      //     const cookieName = table === 'admin_queens' ? 'queen' : 'customer';

      //     res.cookie(cookieName, token, {
      //       httpOnly: true,
      //       maxAge: maxAge * 1000,
      //     });

      //     // if the request comes from the android user then send this request
      //     req.andro === true && res.set(cookieName, token);

      //     res
      //       .status(200)
      //       .json({ success: true, message: 'User successfully created' });
      //   }
      // });
    },
    { dirName: table === 'admin_queens' ? 'queens' : 'customers' }
  );
};

/////////////////////////////////////////////////////////////
// Login a  user (queen/customer)
////////////////////////////////////////////////////////////
authControllers.login = (table) => {
  return async (req, res, next) => {
    const { phone, password } = req.body;

    const user = await prisma[table].findUnique({
      where: { phone },
    });

    console.log({ user });

    const {
      password: getPassword,
      name,
      address,
      photo,
      bank_name,
      account_number,
    } = user;
    console.log({ password, getPassword });
    const isPassValid = await bcrypt.compare(password, getPassword);

    if (isPassValid) {
      const token = createToken({ name, phone, address });
      const cookieName = table === 'admin_queens' ? 'queen' : 'customer';

      res.cookie(cookieName, token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });

      // if the request comes from the android user then send this request
      req.andro === true && res.set(cookieName, token);

      res.status(200).json({
        success: true,
        name,
        phone,
        photo,
        address,
        bank_name,
        account_number,
      });
    } else {
      next(
        new CustomError('Username or password is incorrect', 400, 'Bad request')
      );
    }

    // const q = `SELECT name, phone, password, photo, ${
    //   table === 'admin_queens' && 'bank_name'
    // }, ${
    //   table === 'admin_queens' && 'account_number'
    // }, address FROM ${table} WHERE phone = '${phone}'`;

    // const filteredQ = q.replace(/[']*(false|undefined)[']*[,]*/gi, '');

    // db.query(
    //   filteredQ,
    //   asyncQueryWrapper(
    //     async (err, result) => {
    //       try {
    //         if (err) {
    //           next(new CustomError(err.message, 400, err.code));
    //         } else if (result.length < 1) {
    //           next(
    //             new CustomError(
    //               'Username or password is incorrect!!',
    //               400,
    //               'Bad request'
    //             )
    //           );
    //         } else {
    //           const isPassValid = await bcrypt.compare(
    //             password,
    //             result[0].password
    //           );

    //           if (isPassValid) {
    //             const {
    //               name,
    //               phone,
    //               photo,
    //               address,
    //               bank_name,
    //               account_number,
    //             } = result[0];

    //             const token = createToken({ name, phone, address });
    //             const cookieName =
    //               table === 'admin_queens' ? 'queen' : 'customer';

    //             res.cookie(cookieName, token, {
    //               httpOnly: true,
    //               maxAge: maxAge * 1000,
    //             });

    //             // if the request comes from the android user then send this request
    //             req.andro === true && res.set(cookieName, token);

    //             res.status(200).json({
    //               success: true,
    //               name,
    //               phone,
    //               photo,
    //               address,
    //               bank_name,
    //               account_number,
    //             });
    //           } else {
    //             next(
    //               new CustomError(
    //                 'Username or password is incorrect',
    //                 400,
    //                 'Bad request'
    //               )
    //             );
    //           }
    //         }
    //       } catch (err) {
    //         next(err.message, 500, 'Unknown error');
    //       }
    //     },
    //     { next }
    //   )
    // );
  };
};

module.exports = authControllers;
