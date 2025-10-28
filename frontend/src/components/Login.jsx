import React, { useState } from 'react';
import { authAPI } from '../api';
import './Auth.css';

const Login = ({ onToggleForm, onLoginSuccess, onForgotPassword, onResetPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error khi user nhập
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Đăng nhập thành công!');
        
        // Lưu token và user info
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        // Reset form
        setFormData({
          email: '',
          password: ''
        });

        // Callback để chuyển sang trang chính
        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess(response.data.data.user);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Đăng Nhập</h2>
        <p className="auth-subtitle">Chào mừng trở lại!</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className="auth-switch" style={{ marginTop: '10px' }}>
          <button 
            onClick={onForgotPassword} 
            className="link-button"
            disabled={loading}
            style={{ fontSize: '14px' }}
          >
            Quên mật khẩu?
          </button>
          {' | '}
          <button 
            onClick={onResetPassword} 
            className="link-button"
            disabled={loading}
            style={{ fontSize: '14px' }}
          >
            Đặt lại mật khẩu
          </button>
        </p>

        <p className="auth-switch">
          Chưa có tài khoản?{' '}
          <button 
            onClick={onToggleForm} 
            className="link-button"
            disabled={loading}
          >
            Đăng ký tại đây
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
