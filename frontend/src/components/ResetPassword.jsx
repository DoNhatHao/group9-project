import React, { useState } from 'react';
import { authAPI } from '../api';
import './Auth.css';

const ResetPassword = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    resetToken: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.resetToken || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(
        formData.resetToken,
        formData.newPassword
      );

      if (response.data.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setFormData({ resetToken: '', newPassword: '', confirmPassword: '' });
        
        // Redirect to login sau 2 giây
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 
        'Error resetting password. Please check your token and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your reset token and new password</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="resetToken">Reset Token</label>
            <input
              type="text"
              id="resetToken"
              name="resetToken"
              value={formData.resetToken}
              onChange={handleChange}
              placeholder="Paste your reset token here"
              disabled={loading}
            />
            <small style={{ fontSize: '12px', color: '#666' }}>
              Copy the token from the email or forgot password page
            </small>
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
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="auth-switch">
          Remember your password?{' '}
          <button 
            onClick={onBack} 
            className="link-button"
            disabled={loading}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
