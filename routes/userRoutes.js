const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllUsers,
  registerNewUser,
  loginUser,
  deleteUser,
  updateUser,
  searchByGovernment,
  forgetPassword,
  updatePassword,
  isAcceptedDoc,
  upToAdmin,
  upToSupervisor,
  downToUser,
  filterWithSub,
  filterWithAdmin,
  getAllUsersAndAdminAndSup,
  updateUserDocImg,
  getSingleUser,
  upToOwner,
  updateUserInDashboard,
  getAllUsersAndAdminAndSupWithoutSkip,
  searchByName
} = require('../controllers/userController');
const { restrictTo, auth } = require('../middlewares/auth');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
router.post('/login', loginUser);
router.post(
  '/register',
  upload.fields([
    { name: 'selfImg', maxCount: 1 },
    { name: 'docImg', maxCount: 1 },
  ]),
  registerNewUser
);

router.patch('/upToOwner/:userId/:upUserId', auth, restrictTo('owner','admin'), upToOwner);

router.patch('/up/:userId/:upUserId', auth, restrictTo('owner','admin'), upToAdmin);

router.patch(
  '/upS/:userId/:upUserId',
  auth,
  restrictTo('admin', 'owner'),
  upToSupervisor
);
router.patch(
  '/down/:userId/:upUserId',
  auth,
  restrictTo('admin', 'owner'),
  downToUser
);

router.patch(
  '/accept/:userId/:upUserId',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  isAcceptedDoc
);

router.post('/forgetPassword', forgetPassword);
router.patch('/success/:id', updatePassword);
router.get('/', auth, restrictTo('admin', 'owner'), getAllUsers);
router.get('/all',auth, restrictTo('owner','admin'), getAllUsersAndAdminAndSup);
router.get('/allWithout',auth, restrictTo('owner','admin'), getAllUsersAndAdminAndSupWithoutSkip);
router.get(
  '/search',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  searchByGovernment
);

router.get(
  '/searchName',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  searchByName
);


router.patch('/doc/:id', auth, upload.single('image'), updateUserDocImg);
router.delete('/:id/:userId', auth,deleteUser);

router.patch(
  '/:id',
  auth,
  upload.fields([
    { name: 'selfImg', maxCount: 1 },
    { name: 'docImg', maxCount: 1 },
  ]),
  updateUser
);
router.patch(
  '/:id/:userUpId',
  auth,
  upload.fields([
    { name: 'selfImg', maxCount: 1 },
    { name: 'docImg', maxCount: 1 },
  ]),
  restrictTo('admin', 'supervisor', 'owner'),
  updateUserInDashboard
);

router.get('/single/:id',auth ,getSingleUser);
module.exports = router;
