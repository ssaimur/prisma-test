const router = require('express').Router();
const {
  getAQueen,
  uploadNid,
  queenUpdateInfo,
  queenUpdateBank,
  queenUpdateDp,
  queenUpdatePassword,
  queenUpdateNid,
} = require('../../controllers/adminController/queenController');
const singleUploader = require('../../middlewares/fileUploader/singleUploaderMw');
const multipleUploader = require('../../middlewares/fileUploader/multipleUploaderMw');

// get a Queen
router.get('/getqueen/:phone', getAQueen);

// update queens nids
router.post('/upload/nid/:phone', multipleUploader('nids'), uploadNid);

// update queen's info
router.put('/update/info/:phone', queenUpdateInfo);

// update queen's bank info
router.put('/update/bank/:phone', queenUpdateBank);

// update queen's profile picture
router.put('/update/dp/:phone', singleUploader('queens'), queenUpdateDp);

// update queen's password
router.put('/update/password/:phone', queenUpdatePassword);

module.exports = router;
