const express = require('express');
const { auth, restrictTo } = require('../middlewares/auth');
const {
  getAllNotifications,
} = require('../controllers/notificationController');

const router = express.Router();


router.get('/', auth, getAllNotifications);

module.exports = router;
