const router = require('express').Router();
const {
  register,
  login,
} = require('../../controllers/authController/authController');
const prismaHelper = require('../../middlewares/commonMiddleware/prismaMiddleware');
const singleUploader = require('../../middlewares/fileUploader/singleUploaderMw');

// register a queen
router.post(
  '/queen/register',
  singleUploader('queens'),
  prismaHelper,
  register('admin_queens')
);

// login a queen
router.post('/queen/login', login('admin_queens'));

// register a customer
router.post(
  '/customer/register',
  singleUploader('customers'),
  register('customers')
);

// login a customer
router.post('/customer/login', login('customers'));

module.exports = router;
