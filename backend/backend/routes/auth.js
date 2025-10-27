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

module.exports = router;
