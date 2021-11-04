// const {
//   androRegister,
// } = require('../../androControllers/androAuthController/androQueenAuthController');

const {
  register,
  login,
} = require('../../controllers/authController/authController');
const singleUploader = require('../../middlewares/fileUploader/singleUploaderMw');

const router = require('express').Router();

// register an android queen ;
router.post(
  '/queen/register',
  singleUploader('queens'),
  register('admin_queens')
);

// login an android queen
router.post('/queen/login', login('admin_queens'));

// register an android customer
router.post(
  '/customer/register',
  singleUploader('customers'),
  register('customers')
);

// login an android customer
router.post('/customer/login', login('customers'));

module.exports = router;
