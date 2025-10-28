import React from 'react';
import { authAPI } from '../api';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onNavigateToProfile, onNavigateToAdmin }) => {
  const handleLogout = async () => {
    // Hiển thị thông báo xác nhận đăng xuất
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    
    if (!confirmLogout) {
      return; // Hủy đăng xuất nếu user không confirm
    }

    try {
      await authAPI.logout();
      
      // Xóa token và user info
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Hiển thị thông báo thành công
      alert('Đăng xuất thành công! Hẹn gặp lại.');
      
      // Callback để quay về trang login
      if (onLogout) {
        onLogout();
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Vẫn xóa token và logout ngay cả khi có lỗi
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      alert('Đăng xuất thành công!');
      
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="dashboard-logo">Quản Lý Người Dùng</h1>
        <button onClick={handleLogout} className="btn btn-logout">
          Đăng Xuất
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          
          <h2 className="welcome-title">Chào mừng, {user?.name || 'User'}!</h2>
          <p className="welcome-subtitle">Bạn đã đăng nhập thành công.</p>

          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Vai trò:</span>
              <span className={`badge badge-${user?.role}`}>
                {user?.role === 'admin' ? 'QUẢN TRỊ' : 'NGƯỜI DÙNG'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày tạo tài khoản:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3>Chức Năng Có Sẵn</h3>
          <div className="features-grid">
            <div className="feature-card" onClick={onNavigateToProfile} style={{cursor: 'pointer'}}>
              <div className="feature-icon">👤</div>
              <h4>Quản Lý Hồ Sơ</h4>
              <p>Cập nhật thông tin cá nhân và ảnh đại diện</p>
              <button className="btn-feature">Vào Trang Hồ Sơ</button>
            </div>
            
            {user?.role === 'admin' && (
              <div className="feature-card" onClick={onNavigateToAdmin} style={{cursor: 'pointer'}}>
                <div className="feature-icon">👥</div>
                <h4>Quản Lý Người Dùng</h4>
                <p>Xem và quản lý tất cả người dùng (Chỉ Admin)</p>
                <button className="btn-feature">Vào Trang Quản Trị</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
