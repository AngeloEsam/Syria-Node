const express = require('express');
const multer = require('multer');
const path = require('path');

const { auth, restrictTo } = require('../middlewares/auth');
const {
  getAllMassacres,
  addMassacres,
  deleteMassacres,
  getSingleMassacres,
  searchByTitle,
  updateMassacres,
  acceptMassacresData,
  getAllMassacresUserView,
  searchByTitleFalse,
  searchByTitleName
} = require('../controllers/massacresController');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../postImages'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
router.get('/search', searchByTitle);
router.get('/searchTitle', searchByTitleName);

router.get('/searchFalse', auth, restrictTo('admin', 'supervisor', 'owner'), searchByTitleFalse);
router.patch(
  '/accept/:masId/:userId',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  acceptMassacresData
);

router.get('/', getAllMassacres);
router.get('/userView', getAllMassacresUserView);
router.post(
  '/:userId',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  addMassacres
);

router.delete(
  '/:id/:userId',
  auth,
  restrictTo('admin', 'owner'),
  deleteMassacres
);
router.get('/:id', getSingleMassacres);
router.patch(
  '/update/:id/:userId',
  upload.single('profileImage'),
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  updateMassacres
);
module.exports = router;
