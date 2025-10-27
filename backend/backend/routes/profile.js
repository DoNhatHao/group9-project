const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

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

// @route   DELETE /api/profile
// @desc    Xóa tài khoản của chính mình
// @access  Private
router.delete('/', profileController.deleteOwnAccount);

module.exports = router;
