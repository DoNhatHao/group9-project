const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;


