import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001", // Backend đang chạy ở port 3001
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
};

// User API functions (sẽ dùng sau)
export const userAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
