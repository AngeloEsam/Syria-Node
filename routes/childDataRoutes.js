const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, restrictTo } = require('../middlewares/auth');
const {
  getAllChildData,
  addChildData,
  deleteChildData,
  acceptChildData,
  searchByCategory,
  updateChildData,
  getSingleChildData,
  getAllChildDataUserView,
  searchByCategoryFalse,
  searchByName
} = require('../controllers/childDataContoller');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../imgData'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
router.get('/search', searchByCategory);
router.get('/searchName', searchByName);

router.get('/searchFalse', auth, restrictTo('admin', 'supervisor', 'owner'), searchByCategoryFalse);
router.patch(
  '/:childId/:userId',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  acceptChildData
);
router.get('/', getAllChildData);
router.get('/userView', getAllChildDataUserView);
router.post(
  '/:userId',
  auth,
  upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  addChildData
);

router.delete(
  '/:id/:userId',
  auth,
  restrictTo('admin', 'owner'),
  deleteChildData
);

router.patch(
  '/update/:childDataId/:userId',
  upload.single('profileImage'),
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  updateChildData
);

router.get('/:id', getSingleChildData);

module.exports = router;
