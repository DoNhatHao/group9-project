import React, { useState, useEffect } from 'react';
import { profileAPI } from '../api';
import './Profile.css';

const Profile = ({ user, onProfileUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
      setError('Name and email are required');
      return;
    }

    // Validate password change nếu có
    if (showChangePassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return;
      }
      if (!formData.newPassword) {
        setError('New password is required');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError('New passwords do not match');
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
        setSuccess(response.data.message || 'Profile updated successfully!');
        
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
        'An error occurred while updating profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Password is required to delete account');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await profileAPI.deleteAccount(deletePassword);
      
      if (response.data.success) {
        alert('Account deleted successfully');
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
        'An error occurred while deleting account'
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
        <h2 className="profile-title">My Profile</h2>

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
            <div className="form-group">
              <label>Avatar URL (optional)</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                disabled={loading}
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
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
            <label>Role</label>
            <span className={`badge badge-${user?.role}`}>
              {user?.role?.toUpperCase()}
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
                  {showChangePassword ? '✕ Cancel password change' : '🔒 Change Password'}
                </button>

                {showChangePassword && (
                  <>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password (min 6 characters)"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
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
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
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
                Edit Profile
              </button>
            </div>
          )}
        </form>

        {/* Delete Account Section */}
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <p>Once you delete your account, there is no going back.</p>
          
          {!showDeleteAccount ? (
            <button 
              onClick={() => setShowDeleteAccount(true)}
              className="btn btn-danger"
              disabled={loading}
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-account-form">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password to confirm"
                disabled={loading}
              />
              <div className="delete-actions">
                <button 
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Confirm Delete'}
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
                  Cancel
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
