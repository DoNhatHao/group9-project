const mongoose = require('mongoose');

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
  }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

// Create and export User model
const User = mongoose.model('User', userSchema);

module.exports = User;

