const router = require('express').Router();
const {
  newOffer,
  getAllOffers,
  deleteOffer,
} = require('../../controllers/adminController/offerController');

// add a new offer
router.post('/new-offer', newOffer);

// gett all offers
router.get('/get-all/:phone', getAllOffers);

// delete all offers
router.delete('/delete/:id', deleteOffer);

module.exports = router;
