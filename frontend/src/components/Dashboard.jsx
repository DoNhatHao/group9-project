import React from 'react';
import { authAPI } from '../api';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onNavigateToProfile, onNavigateToAdmin }) => {
  const handleLogout = async () => {
    // Hiển thị thông báo xác nhận đăng xuất
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (!confirmLogout) {
      return; // Hủy đăng xuất nếu user không confirm
    }

    try {
      await authAPI.logout();
      
      // Xóa token và user info
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Hiển thị thông báo thành công
      alert('Logout successful! See you again.');
      
      // Callback để quay về trang login
      if (onLogout) {
        onLogout();
      }
    } catch (err) {
      console.error('Logout error:', err);
      // Vẫn xóa token và logout ngay cả khi có lỗi
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      alert('Logged out successfully.');
      
      if (onLogout) {
        onLogout();
      }
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="dashboard-logo">User Management</h1>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
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
          
          <h2 className="welcome-title">Welcome, {user?.name || 'User'}!</h2>
          <p className="welcome-subtitle">You have successfully logged in.</p>

          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className={`badge badge-${user?.role}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Created:</span>
              <span className="info-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3>Available Features</h3>
          <div className="features-grid">
            <div className="feature-card" onClick={onNavigateToProfile} style={{cursor: 'pointer'}}>
              <div className="feature-icon">👤</div>
              <h4>Profile Management</h4>
              <p>Update your personal information and avatar</p>
              <button className="btn-feature">Go to Profile</button>
            </div>
            
            {user?.role === 'admin' && (
              <div className="feature-card" onClick={onNavigateToAdmin} style={{cursor: 'pointer'}}>
                <div className="feature-icon">👥</div>
                <h4>User Management</h4>
                <p>View and manage all users (Admin only)</p>
                <button className="btn-feature">Go to Admin Panel</button>
              </div>
            )}
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h4>Security Settings</h4>
              <p>Change password and manage security</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
