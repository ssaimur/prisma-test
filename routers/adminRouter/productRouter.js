const router = require('express').Router();

const {
  queenUploadProduct,
  queenGetAllProduct,
  queenUpdateProduct,
  queendeleteProduct,
} = require('../../controllers/adminController/productController');

const productUploader = require('../../middlewares/fileUploader/productUploaderMw');

// queen upload products
router.post('/upload/:phone', productUploader('products'), queenUploadProduct);

// queen get all products
router.get('/get/all/:phone', queenGetAllProduct);

// queen update products
router.put('/update/:id', productUploader('products'), queenUpdateProduct);

// queen delete product
router.delete('/delete/:id', queendeleteProduct);

module.exports = router;
