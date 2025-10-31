import api from './api';

const adminService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (data) => {
    const response = await api.post('/api/admin/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id, data) => {
    const response = await api.put(`/api/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  }
};

export default adminService;


