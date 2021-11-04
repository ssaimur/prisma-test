const db = require('../../dbcon');
const CustomError = require('../../errors/customError');

const controller = {};

// get all offers
controller.newOffer = (req, res, next) => {
  const { product_id, phone, offer_type, offer_desc, exp_date } = req.body;

  const q = `INSERT INTO admin_offers (product_id, queen_phone, offer_type, offer_desc, exp_date) VALUES ('${product_id}','${phone}','${offer_type}','${offer_desc}','${exp_date}')`;
  db.query(q, (err) => {
    if (err) {
      next(new CustomError(err.message, 500, 'Databse Error!!'));
    } else {
      res
        .status(200)
        .json({ success: true, message: 'Offer successfully added' });
    }
  });
};

// get all offers
controller.getAllOffers = (req, res, next) => {
  const { phone } = req.params;

  const q = `SELECT admin_products.product_name, admin_products.product_picture_1, admin_offers.id, admin_offers.product_id, admin_offers.offer_type, admin_offers.offer_desc, admin_offers.exp_date, admin_offers.status FROM admin_offers INNER JOIN admin_products ON admin_offers.product_id = admin_products.id WHERE admin_offers.queen_phone ='${phone}' AND admin_offers.status <> 'Disable'`;
  db.query(q, (err, result) => {
    if (err) {
      next(new CustomError(err.message, 500, 'Database Error'));
    } else {
      res.status(200).json({ success: true, data: result });
    }
  });
};

// delete a offer
controller.deleteOffer = (req, res, next) => {
  const { id } = req.params;
  const { phone } = req.body;

  const q = `SELECT queen_phone FROM admin_offers WHERE id = ${id}`;
  db.query(q, (err, result) => {
    if (err) {
      next(new CustomError(err.message, 500, 'Database Error'));
    } else {
      if (result[0].queen_phone === phone) {
        const r = `UPDATE admin_offers SET status ='Disabled' WHERE id = ${id}`;
        db.query(r, (err, result) => {
          if (err) {
            next(new CustomError(err.message, 500, 'Database Error!!'));
          } else {
            res
              .status(200)
              .json({ success: true, message: 'Offer successfully removed' });
          }
        });
      } else {
        next(
          new CustomError('You can only delete your offer', 400, 'Bad request')
        );
      }
    }
  });
};

module.exports = controller;
