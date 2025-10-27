import React, { useState, useEffect } from 'react';
import { profileAPI } from '../api';
import './Profile.css';

const Profile = ({ user, onProfileUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    avatar: user?.avatar || ''
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Update form khi user prop thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file phải nhỏ hơn 5MB');
      return;
    }

    setUploadingAvatar(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('avatar', file);

      const response = await profileAPI.uploadAvatar(formDataToSend);

      if (response.data.success) {
        setSuccess('Tải ảnh đại diện lên thành công!');
        setFormData(prev => ({ ...prev, avatar: response.data.data.avatar }));
        
        // Update user in parent component
        if (onProfileUpdate) {
          onProfileUpdate(response.data.data.user);
        }

        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Upload avatar error:', err);
      setError(
        err.response?.data?.message || 
        'Lỗi khi tải ảnh lên. Vui lòng thử lại.'
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email) {
      setError('Tên và email là bắt buộc');
      return;
    }

    // Validate password change nếu có
    if (showChangePassword) {
      if (!formData.currentPassword) {
        setError('Mật khẩu hiện tại là bắt buộc để đổi mật khẩu');
        return;
      }
      if (!formData.newPassword) {
        setError('Mật khẩu mới là bắt buộc');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError('Mật khẩu mới không khớp');
        return;
      }
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      };

      // Thêm password nếu đang đổi password
      if (showChangePassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await profileAPI.updateProfile(updateData);

      if (response.data.success) {
        setSuccess(response.data.message || 'Cập nhật hồ sơ thành công!');
        
        // Cập nhật user info trong localStorage
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Callback để update App state
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }

        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setShowChangePassword(false);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError(
        err.response?.data?.message || 
        'Đã xảy ra lỗi khi cập nhật hồ sơ'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Mật khẩu là bắt buộc để xóa tài khoản');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await profileAPI.deleteAccount(deletePassword);
      
      if (response.data.success) {
        alert('Xóa tài khoản thành công');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (onLogout) {
          onLogout();
        }
      }
    } catch (err) {
      console.error('Delete account error:', err);
      setError(
        err.response?.data?.message || 
        'Đã xảy ra lỗi khi xóa tài khoản'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowChangePassword(false);
    setError('');
    setSuccess('');
    // Reset form to current user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      avatar: user?.avatar || ''
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Hồ Sơ Của Tôi</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {formData.avatar ? (
              <img src={formData.avatar} alt={formData.name} />
            ) : (
              <div className="avatar-placeholder-large">
                {formData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          {isEditing && (
            <>
              <div className="form-group">
                <label>Tải lên ảnh đại diện (Ảnh - tối đa 5MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  style={{ marginBottom: '10px' }}
                />
                {uploadingAvatar && <small>Đang tải lên...</small>}
              </div>
              <div className="form-group">
                <label>Hoặc nhập URL ảnh đại diện</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={loading}
                />
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Họ và Tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing || loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing || loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Vai trò</label>
            <span className={`badge badge-${user?.role}`}>
              {user?.role === 'admin' ? 'QUẢN TRỊ' : 'NGƯỜI DÙNG'}
            </span>
          </div>

          {isEditing && (
            <>
              <div className="change-password-section">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="btn-link"
                  disabled={loading}
                >
                  {showChangePassword ? '✕ Hủy đổi mật khẩu' : '🔒 Đổi Mật Khẩu'}
                </button>

                {showChangePassword && (
                  <>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu hiện tại"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">Mật khẩu mới</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={loading}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="profile-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Hủy
                </button>
              </div>
            </>
          )}

          {!isEditing && (
            <div className="profile-actions">
              <button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Chỉnh Sửa Hồ Sơ
              </button>
            </div>
          )}
        </form>

        {/* Delete Account Section */}
        <div className="danger-zone">
          <h3>Vùng Nguy Hiểm</h3>
          <p>Khi bạn xóa tài khoản, dữ liệu sẽ không thể khôi phục.</p>
          
          {!showDeleteAccount ? (
            <button 
              onClick={() => setShowDeleteAccount(true)}
              className="btn btn-danger"
              disabled={loading}
            >
              Xóa Tài Khoản
            </button>
          ) : (
            <div className="delete-account-form">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Nhập mật khẩu để xác nhận"
                disabled={loading}
              />
              <div className="delete-actions">
                <button 
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading ? 'Đang xóa...' : 'Xác Nhận Xóa'}
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteAccount(false);
                    setDeletePassword('');
                    setError('');
                  }}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
