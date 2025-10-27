import React, { useState } from 'react';
import { authAPI } from '../api';
import './Auth.css';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);

      if (response.data.success) {
        setSuccess('Password reset instructions sent! Check the reset token below.');
        setResetToken(response.data.resetToken);
        setEmail('');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message || 
        'Error sending reset instructions. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your email and we'll send you reset instructions
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              {success}
              {resetToken && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                  <strong>Reset Token:</strong><br />
                  <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>{resetToken}</code>
                  <p style={{ marginTop: '10px', fontSize: '13px' }}>
                    Copy this token and use it in the Reset Password page.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPassword;
