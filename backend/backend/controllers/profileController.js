const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Lấy thông tin profile của user hiện tại
// @route   GET /api/profile
// @access  Private (cần token)
exports.getProfile = async (req, res) => {
  try {
    // req.user đã được set bởi authenticate middleware
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Cập nhật thông tin profile
// @route   PUT /api/profile
// @access  Private (cần token)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, avatar } = req.body;

    // Tìm user hiện tại
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cập nhật name nếu có
    if (name && name !== user.name) {
      user.name = name;
    }

    // Cập nhật email nếu có
    if (email && email !== user.email) {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      user.email = email;
    }

    // Cập nhật avatar nếu có
    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    // Đổi password nếu có
    if (newPassword) {
      // Kiểm tra current password
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password'
        });
      }

      // Verify current password
      const isPasswordCorrect = await user.comparePassword(currentPassword);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }

      user.password = newPassword;
    }

    // Lưu user (password sẽ tự động được hash bởi pre-save hook)
    await user.save();

    // Trả về thông tin đã cập nhật (không bao gồm password)
    const updatedUser = await User.findById(user._id);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Xóa tài khoản của chính mình
// @route   DELETE /api/profile
// @access  Private (cần token)
exports.deleteOwnAccount = async (req, res) => {
  try {
    const { password } = req.body;

    // Kiểm tra password để confirm
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Tìm user và lấy password
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Xóa user
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
};
