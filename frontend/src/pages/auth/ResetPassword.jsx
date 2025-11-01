import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import authService from '../../services/authService';
import { Button, Input, Card, PasswordStrength } from '../../components/ui';
import { showSuccess, showError } from '../../utils/toast';
import './Login.css';

const ResetPassword = () => {
  const { token: tokenFromUrl } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resetToken: tokenFromUrl || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.resetToken) {
      showError('Vui lòng nhập mã token đặt lại mật khẩu.');
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      showError('Vui lòng điền đầy đủ cả hai trường mật khẩu.');
      return;
    }

    if (formData.password.length < 6) {
      showError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(formData.resetToken, formData.password);
      showSuccess('Cập nhật mật khẩu thành công.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card" elevated>
        <div className="auth-card__brand">Group9 Console</div>

        <div className="auth-card__header">
          <h1>Tạo mật khẩu mới</h1>
          <p>Nhập mã token từ email và chọn mật khẩu mới của bạn.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-inline-label" htmlFor="resetToken">
            Mã token đặt lại
          </label>
          <Input
            id="resetToken"
            type="text"
            value={formData.resetToken}
            onChange={(event) => setFormData({ ...formData, resetToken: event.target.value })}
            placeholder="Dán mã token từ email hoặc link"
            autoComplete="off"
            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
          />

          <label className="auth-inline-label" htmlFor="password">
            Mật khẩu mới
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            placeholder="Ít nhất 6 ký tự"
            autoComplete="new-password"
          />
          {formData.password && <PasswordStrength password={formData.password} />}

          <label className="auth-inline-label" htmlFor="confirmPassword">
            Xác nhận mật khẩu
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            error={
              formData.confirmPassword && formData.password !== formData.confirmPassword
                ? 'Mật khẩu xác nhận không khớp.'
                : ''
            }
          />

          <div className="auth-password-help">
            <span>Mẹo tạo mật khẩu:</span>
            <ul>
              <li>Sử dụng ít nhất 6 ký tự.</li>
              <li>Kết hợp chữ hoa, chữ thường và số.</li>
              <li>Thêm ký tự đặc biệt để tăng độ bảo mật.</li>
            </ul>
          </div>

          <Button type="submit" variant="primary" block disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </Button>
        </form>

        <div className="auth-card__footer">
          <span>Đã nhớ lại mật khẩu?</span>
          <Link to="/login" className="auth-link">
            Quay lại đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;

