const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Không trả về password khi query
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpire: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  // Chỉ mã hóa nếu password bị thay đổi
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method tạo reset password token
userSchema.methods.getResetPasswordToken = function() {
  // Tạo token ngẫu nhiên
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token và lưu vào database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire time: 10 phút
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  // Trả về token gốc (không hash) để gửi email
  return resetToken;
};

// Create and export User model
const User = mongoose.model('User', userSchema);

module.exports = User;

