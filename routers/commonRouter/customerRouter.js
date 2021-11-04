const {
  getSingleCustomer,
  updateCustomerInfo,
} = require('../../controllers/commonController/customerController');
const singleUploader = require('../../middlewares/fileUploader/singleUploaderMw');

const router = require('express').Router();

// get a customer
router.get('/get/:id', getSingleCustomer);

// update customer info
router.put('/update/:id', singleUploader('customers'), updateCustomerInfo);

module.exports = router;
