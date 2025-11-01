const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user'); // Keep old CRUD for compatibility

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/users', userRoutes); // Legacy route

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Group Project API - Authentication & User Management',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth - signup, login, logout, me, forgot-password, reset-password',
      profile: '/api/profile - GET, PUT, password, avatar, delete',
      admin: '/api/admin - users management (admin only)',
      users: '/users - legacy CRUD (deprecated)'
    }
  });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupDB';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


