const db = require('../../dbcon');
const CustomError = require('../../errors/customError');
const deleteFile = require('../../utils/fileRemover');
const productUpdateQuery = require('../../utils/queryHelper');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const controller = {};

// queen upload product
controller.queenUploadProduct = async (req, res, next) => {
  const { phone, id } = req.params;
  const { product_name, category, price, delivery_day, short_desc } = req.body;
  const product_picture_1 = req.files[0] && req.files[0].filename;
  const product_picture_2 = req.files[1] && req.files[1].filename;

  const product = await prisma.admin_products.create({
    where: { id },
    data: {
      queen_phone: phone,
      product_name,
      category,
      price,
      delivery_day,
      short_desc,
      product_picture_1,
      product_picture_2,
    },
  });

  res.status(200).json({ success: true, data: product });
  // const filteredQ = productUpdateQuery(req, 'upload');

  // const files = [];

  // [
  //   req.files[0] && req.files[0].filename,
  //   req.files[1] && req.files[1].filename,
  // ].map((item) => item !== undefined && files.push(item));

  // db.query(filteredQ, (err) => {
  //   if (err) {
  //     deleteFile('products', files, (err) => {
  //       if (err) {
  //         console.log({ err });
  //       }
  //     });

  //     next(new CustomError(err.message, 500, err.code));
  //   } else {
  //     res
  //       .status(200)
  //       .json({ success: true, message: 'Pruduct successfully uploaded' });
  //   }
  // });
};

// queen get all products
controller.queenGetAllProduct = (req, res, next) => {
  const { phone } = req.params;

  const q = `SELECT * FROM admin_products WHERE queen_phone='${phone}'`;
  db.query(q, (err, result) => {
    if (err) {
      next(new CustomError(err.message, 500, err.code));
    } else {
      res.status(200).json({ success: true, data: result });
    }
  });
};

// queen update product
controller.queenUpdateProduct = (req, res, next) => {
  const { phone, id } = req.params;
  const { product_name, category, price, delivery_day, short_desc } = req.body;

  const product_picture_1 = req.files[0] && req.files[0].filename;
  const product_picture_2 = req.files[1] && req.files[1].filename;

  const fieldsName = req.files.map((item) => item.fieldname);

  const fieldsToUpdate = {};

  if (fieldsName.includes('product_picture_1')) {
    fieldsToUpdate.product_picture_1 = product_picture_1;
  }
  if (fieldsName.includes('product_picture_2')) {
    fieldsToUpdate.product_picture_2 = product_picture_2 || product_picture_1;
  }

  const updatedProduct = prisma.admin_products.update({
    where: { id },
    data: {
      queen_phone: phone,
      product_name,
      category,
      price,
      delivery_day,
      short_desc,
      ...fieldsToUpdate,
    },
  });

  res.status(200).json({ success: true, data: updatedProduct });

  // const filteredQ = productUpdateQuery(req, 'update');

  // const files = [];

  // [
  //   req.files[0] && req.files[0].filename,
  //   req.files[1] && req.files[1].filename,
  // ].map((item) => item !== undefined && files.push(item));

  // db.query(filteredQ, (err) => {
  //   if (err) {
  //     deleteFile('products', files, (err) => {
  //       if (err) {
  //         console.log({ err });
  //       }
  //     });

  //     next(new CustomError(err.message, 500, err.code));
  //   } else {
  //     res
  //       .status(200)
  //       .json({ success: true, message: 'Pruduct successfully updated' });
  //   }
  // });
};

// queen delete product
controller.queendeleteProduct = (req, res, next) => {
  const { id } = req.params;
  const { phone } = req.body;

  db.query(
    `SELECT queen_phone FROM admin_products WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        next(new CustomError(err.message, 500, err.code));
      } else {
        if (result[0].queen_phone === phone) {
          db.query(
            `UPDATE admin_products SET status = 'Disabled' WHERE id = ${id}`,
            (err) => {
              if (err) {
                next(new CustomError(err.message, 500, err.code));
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Product successfully deleted',
                });
              }
            }
          );
        } else {
          next(
            new CustomError("You cannot delete other's product"),
            401,
            'Unauthorized'
          );
        }
      }
    }
  );
};

module.exports = controller;
