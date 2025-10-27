const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Tất cả routes yêu cầu authentication và role admin
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /api/users
// @desc    Lấy danh sách tất cả users
// @access  Private + Admin
router.get('/', userController.getUsers);

// @route   GET /api/users/:id
// @desc    Lấy thông tin 1 user
// @access  Private + Admin
router.get('/:id', userController.getUserById);

// @route   POST /api/users
// @desc    Tạo user mới
// @access  Private + Admin
router.post('/', userController.createUser);

// @route   PUT /api/users/:id
// @desc    Cập nhật user
// @access  Private + Admin
router.put('/:id', userController.updateUser); // PUT

// @route   DELETE /api/users/:id
// @desc    Xóa user
// @access  Private + Admin
router.delete('/:id', userController.deleteUser); // DELETE

module.exports = router;