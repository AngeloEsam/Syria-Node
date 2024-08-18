const express = require('express');
const {
  getAllMessagesPaypals,

  searchByIdOrCategory,
} = require('../controllers/messagePaypalController');
const { auth, restrictTo } = require('../middlewares/auth');
const { getAllSgelData,deleteSgelItem } = require('../controllers/sgelController');

const router = express.Router();


router.get('/', auth,restrictTo('admin', 'supervisor', 'owner'),getAllSgelData);

router.delete(
  '/:id',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  deleteSgelItem
);

module.exports = router;
