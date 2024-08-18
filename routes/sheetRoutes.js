const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, restrictTo } = require('../middlewares/auth');
const {
  insertSheet,
  getSheet,
  addRow,
  getSingleRow,
  deleteRow,
  searchByName,
} = require('../controllers/sheetController');
const router = express.Router();

var upload = multer({ dest: 'upload/' });
router.get('/search', searchByName);
router.post(
  '/add',
  auth,
  restrictTo('admin', 'owner'),
  upload.single('file'),
  insertSheet
);
router.get('/all', auth, getSheet);
router.post(
  '/addOne',
  auth,
  restrictTo('admin', 'supervisor', 'owner'),
  addRow
);
router.get('/:id', auth, restrictTo('admin', 'owner'), getSingleRow);
router.delete('/delete/:id', auth, restrictTo('admin', 'owner'), deleteRow);

module.exports = router;
