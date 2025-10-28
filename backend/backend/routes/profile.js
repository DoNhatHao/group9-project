const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Tất cả routes dưới đây đều cần authentication
router.use(authenticate);

// @route   GET /api/profile
// @desc    Lấy thông tin profile của user hiện tại
// @access  Private
router.get('/', profileController.getProfile);

// @route   PUT /api/profile
// @desc    Cập nhật thông tin profile
// @access  Private
router.put('/', profileController.updateProfile);

// @route   POST /api/profile/avatar
// @desc    Upload avatar
// @access  Private
router.post('/avatar', upload.single('avatar'), profileController.uploadAvatar);

// @route   DELETE /api/profile
// @desc    Xóa tài khoản của chính mình
// @access  Private
router.delete('/', profileController.deleteOwnAccount);

module.exports = router;
