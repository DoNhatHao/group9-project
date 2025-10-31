import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Field, Input, PasswordInput, Checkbox } from '../../components/ui';
import { showError, showSuccess } from '../../utils/toast';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      email: formData.email ? '' : 'Vui lòng nhập email.',
      password: formData.password ? '' : 'Vui lòng nhập mật khẩu.',
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      showError('Vui lòng kiểm tra lại các trường được đánh dấu.');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password, rememberMe);
      showSuccess('Đăng nhập thành công.');
      navigate('/');
    } catch (error) {
      showError(error.response?.data?.message || 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card" elevated>
        <div className="auth-card__brand">Group9 Console</div>

        <div className="auth-card__header">
          <h1>Chào mừng trở lại</h1>
          <p>Đăng nhập để truy cập bảng điều khiển quản lý người dùng.</p>
        </div>

        <div className="auth-demo">
          <span className="auth-demo__label">Tài khoản demo</span>
          <div className="auth-demo__rows">
            <span>Email: admin@example.com</span>
            <span>Mật khẩu: admin123</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Field error={errors.email} required>
            <Field.Label>Email</Field.Label>
            <Field.Control>
              <Input
              type="email"
              value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                placeholder="ban@example.com"
                autoComplete="email"
            />
            </Field.Control>
            <Field.Message>{errors.email}</Field.Message>
          </Field>

          <Field error={errors.password} required>
            <Field.Label>Mật khẩu</Field.Label>
            <Field.Control>
              <PasswordInput
              value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </Field.Control>
            <Field.Message>{errors.password}</Field.Message>
          </Field>

          <div className="auth-form__meta">
            <Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}>
              Ghi nhớ thiết bị này
            </Checkbox>
            <Link to="/forgot-password" className="auth-link">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" variant="primary" block loading={loading}>
            Đăng nhập
          </Button>
        </form>

        <div className="auth-card__footer">
          <span>Mới sử dụng Group9-project?</span>
          <Link to="/signup" className="auth-link">
            Tạo tài khoản
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;

