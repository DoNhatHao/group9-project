const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  deleteAccount
} = require('../controllers/profileController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// All routes are protected
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/', protect, deleteAccount);

module.exports = router;


