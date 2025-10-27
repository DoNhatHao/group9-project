const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Đăng ký user mới
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/logout
// @desc    Đăng xuất
// @access  Public
router.post('/logout', authController.logout);

// @route   POST /api/auth/forgot-password
// @desc    Gửi yêu cầu reset password
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password với token
// @access  Public
router.put('/reset-password/:resetToken', authController.resetPassword);

module.exports = router;
