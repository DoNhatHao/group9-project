// server.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();
const app = express();


/* ===================== CORS (DEV SAFE) ===================== *
 * Dùng cors() mặc định -> Access-Control-Allow-Origin: *
 * => Không cần tự set header thủ công (tránh xung đột)
 * Nếu sau này bạn DÙNG COOKIE (credentials), xem ghi chú bên dưới.
 * ========================================================== */
app.use(cors());
app.options('*', cors()); // xử lý preflight OPTIONS

// Common middlewares
app.use(express.json());

// --- MongoDB ---
if (!process.env.MONGODB_URI) {
  console.error('❌ Missing MONGODB_URI in .env');
  process.exit(1);
}

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout nhanh hơn (5s)
  socketTimeoutMS: 45000,
};

mongoose
  .connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server will continue running without MongoDB...');
    console.log('📝 Please add your IP to MongoDB Atlas whitelist:');
    console.log('   1. Go to https://cloud.mongodb.com/');
    console.log('   2. Select your cluster → Network Access');
    console.log('   3. Add IP Address → Add Current IP Address');
  });


// --- Routes ---
const userRoutes = require('./routes/user'); // đảm bảo đúng file router
app.use('/users', userRoutes)
// --- Health / root ---
app.get('/', (_req, res) => res.json({ message: 'Welcome to the API' }));

// 404 fallback (cho các route chưa khai báo)
app.use((req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler (phòng khi controller throw chưa bắt)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 3001; // <= 3001
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
