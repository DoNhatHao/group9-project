import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Backend đang chạy ở port 3000
});

// Thêm token vào header cho các request cần authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Đăng ký
  signup: (userData) => api.post('/api/auth/signup', userData),
  
  // Đăng nhập
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  // Đăng xuất
  logout: () => api.post('/api/auth/logout'),
  
  // Forgot Password
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  
  // Reset Password
  resetPassword: (resetToken, newPassword) => 
    api.put(`/api/auth/reset-password/${resetToken}`, { newPassword }),
};

// Profile API functions
export const profileAPI = {
  // Lấy thông tin profile
  getProfile: () => api.get('/api/profile'),
  
  // Cập nhật profile
  updateProfile: (profileData) => api.put('/api/profile', profileData),
  
  // Upload avatar
  uploadAvatar: (formData) => api.post('/api/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Xóa tài khoản
  deleteAccount: (password) => api.delete('/api/profile', { data: { password } }),
};

// User API functions (Admin only)
export const userAPI = {
  // Lấy danh sách tất cả users
  getUsers: () => api.get('/api/users'),
  
  // Lấy 1 user theo ID
  getUser: (id) => api.get(`/api/users/${id}`),
  
  // Tạo user mới
  createUser: (userData) => api.post('/api/users', userData),
  
  // Cập nhật user
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
  
  // Xóa user
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};
