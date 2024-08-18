const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  getAllBackgroundImages,
  addBackgroundImage,
  updateBackgroundImage,
  deleteBackgroundImage,
  getSingleBackgroundImage,
} = require('../controllers/backgroundController');
const { auth, restrictTo } = require('../middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../backgroundImages'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get('/', getAllBackgroundImages);
router.post(
  '/add/:id',
  upload.single('image'),
  auth,
  restrictTo('admin', 'owner'),

  addBackgroundImage
);
router.patch(
  '/:id/:userId',
  upload.single('image'),
  auth,
  restrictTo('admin', 'owner'),

  updateBackgroundImage
);
router.get('/:id', getSingleBackgroundImage);
router.delete(
  '/:id/:userId',
  auth,
  restrictTo('admin', 'owner'),
  deleteBackgroundImage
);

module.exports = router;
