import api from './api';

const profileService = {
  // Get profile
  getProfile: async () => {
    const response = await api.get('/api/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put('/api/profile', data);
    return response.data;
  },

  // Update password
  updatePassword: async (data) => {
    const response = await api.put('/api/profile/password', data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/api/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/api/profile');
    return response.data;
  }
};

export default profileService;


