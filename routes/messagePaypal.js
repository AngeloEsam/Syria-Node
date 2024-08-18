const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllMessagesPaypals,
  addMessagePaypal,
  updateMessagePaypal,
  deleteMessagePaypal,
  getSingleMessagePaypal,
  searchByIdOrCategory,
} = require('../controllers/messagePaypalController');
const { auth, restrictTo } = require('../middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../messagePaypal'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get('/search', searchByIdOrCategory);
router.get('/', getAllMessagesPaypals);
router.post(
  '/add/:id',
  upload.single('icon'),
  auth,
  restrictTo('admin', 'owner'),

  addMessagePaypal
);
router.patch(
  '/:id/:userId',
  upload.single('icon'),
  auth,
  restrictTo('admin', 'owner'),

  updateMessagePaypal
);
router.get('/:id', getSingleMessagePaypal);
//delete post
router.delete(
  '/:id/:userId',
  auth,
  restrictTo('admin', 'owner'),
  deleteMessagePaypal
);

module.exports = router;
