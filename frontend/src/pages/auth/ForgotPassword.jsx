import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import { Button, Input, Card } from '../../components/ui';
import { showSuccess, showError, showInfo } from '../../utils/toast';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      showError('Vui lòng nhập email liên kết với tài khoản của bạn.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setResetInfo(response);
      showSuccess('Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.');
      console.log('Reset password link:', response.resetUrl);
      console.log('Reset token:', response.resetToken);
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể gửi email đặt lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(resetInfo.resetToken);
      setCopied(true);
      showSuccess('Đã sao chép token!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showError('Không thể sao chép. Vui lòng copy thủ công.');
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card" elevated>
        <div className="auth-card__brand">Group9 Console</div>

        {!resetInfo ? (
          <>
            <div className="auth-card__header">
              <h1>Quên mật khẩu?</h1>
              <p>Chúng tôi sẽ gửi email với link bảo mật để đặt lại mật khẩu mới.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label className="auth-inline-label" htmlFor="email">
                Địa chỉ email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="team@example.com"
                autoComplete="email"
              />

              <Button type="submit" variant="primary" block disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi hướng dẫn đặt lại'}
              </Button>
            </form>

            <div className="auth-card__footer">
              <span>Nhớ lại mật khẩu?</span>
              <Link to="/login" className="auth-link">
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="auth-card__header">
              <h1>Kiểm tra hộp thư</h1>
              <p>
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Làm theo link trong email để chọn mật khẩu mới.
              </p>
            </div>

            <div className="auth-notice">
              <span className="auth-notice__label">💡 Lưu ý</span>
              <p>
                Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thư rác. Email có hiệu lực trong 10 phút.
              </p>
                <div style={{ marginTop: 'var(--space-md)' }}>
                  <label className="auth-inline-label" htmlFor="reset-token" style={{ marginBottom: 'var(--space-xs)' }}>
                    Mã token đặt lại mật khẩu
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Input
                      id="reset-token"
                      type="text"
                      value={resetInfo.resetToken}
                      readOnly
                      style={{ paddingRight: '3rem', fontFamily: 'monospace', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="copy-button"
                      aria-label="Sao chép token"
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: copied ? 'hsl(var(--positive))' : 'hsl(var(--ink-muted))',
                        transition: 'color 0.2s ease',
                      }}
                      title={copied ? 'Đã sao chép!!' : 'Sao chép'}
                    >
                      {copied ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="auth-card__footer">
                <Link to={`/reset-password/${resetInfo.resetToken}`} className="auth-link">
                  Đặt lại mật khẩu →
                </Link>
              </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;

