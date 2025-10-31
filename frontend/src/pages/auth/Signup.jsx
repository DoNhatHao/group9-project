import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Field, Input, PasswordInput, PasswordStrength, Checkbox } from '../../components/ui';
import { showError, showSuccess } from '../../utils/toast';
import './Login.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      name: formData.name ? '' : 'Vui lòng nhập họ tên đầy đủ.',
      email: formData.email ? '' : 'Vui lòng nhập email.',
      password: formData.password.length >= 6 ? '' : 'Mật khẩu phải có ít nhất 6 ký tự.',
      confirmPassword: formData.password === formData.confirmPassword ? '' : 'Mật khẩu nhập lại không khớp.',
      terms: agreedToTerms ? '' : 'Bạn cần đồng ý điều khoản để tiếp tục.',
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      showError('Vui lòng kiểm tra lại các trường được đánh dấu.');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      showSuccess('Tạo tài khoản thành công.');
      navigate('/');
    } catch (error) {
      showError(error.response?.data?.message || 'Đăng ký không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card" elevated>
        <div className="auth-card__brand">Group9 Console</div>

        <div className="auth-card__header">
          <h1>Tạo tài khoản mới</h1>
          <p>Bắt đầu workspace của bạn và quản lý người dùng trong vài phút.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Field error={errors.name} required>
            <Field.Label>Họ và tên</Field.Label>
            <Field.Control>
              <Input
              value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </Field.Control>
            <Field.Message>{errors.name}</Field.Message>
          </Field>

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
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
              />
            </Field.Control>
            <PasswordStrength password={formData.password} />
            <Field.Message>{errors.password}</Field.Message>
          </Field>

          <Field error={errors.confirmPassword} required>
            <Field.Label>Nhập lại mật khẩu</Field.Label>
            <Field.Control>
              <PasswordInput
              value={formData.confirmPassword}
                onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
            </Field.Control>
            <Field.Message>{errors.confirmPassword}</Field.Message>
          </Field>

          <div className="auth-terms">
            <Checkbox checked={agreedToTerms} onChange={(event) => setAgreedToTerms(event.target.checked)}>
              Tôi đồng ý với{' '}
              <a href="#terms" className="auth-link">
                điều khoản sử dụng
              </a>
            </Checkbox>
            {errors.terms && <span className="auth-terms__error">{errors.terms}</span>}
          </div>

          <Button type="submit" variant="primary" block loading={loading}>
            Tạo tài khoản
          </Button>
        </form>

        <div className="auth-card__footer">
          <span>Đã có tài khoản?</span>
          <Link to="/login" className="auth-link">
            Đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;

