import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, Avatar, PasswordStrength, Modal, Field, PasswordInput, PageHeader } from '../components/ui';
import profileService from '../services/profileService';
import { showError, showSuccess } from '../utils/toast';
import { API_URL } from '../api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [profileErrors, setProfileErrors] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const resetProfileForm = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setProfileErrors({ name: '', email: '' });
  };

  const resetPasswordForm = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    const nextErrors = {
      name: profileData.name ? '' : 'Vui lòng nhập họ tên.',
      email: profileData.email && /.+@.+\..+/.test(profileData.email) ? '' : 'Vui lòng nhập email hợp lệ.',
    };

    setProfileErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      showError('Vui lòng kiểm tra lại thông tin hồ sơ.');
      return;
    }

    setProfileSaving(true);
    try {
      const response = await profileService.updateProfile(profileData);
      updateUser(response.user);
      showSuccess('Cập nhật hồ sơ thành công.');
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    const nextErrors = {
      currentPassword: passwordData.currentPassword ? '' : 'Vui lòng nhập mật khẩu hiện tại.',
      newPassword:
        passwordData.newPassword.length >= 6 ? '' : 'Mật khẩu mới phải có ít nhất 6 ký tự.',
      confirmPassword:
        passwordData.newPassword === passwordData.confirmPassword ? '' : 'Mật khẩu nhập lại không khớp.',
    };

    setPasswordErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      showError('Vui lòng kiểm tra lại thông tin mật khẩu.');
      return;
    }

    setPasswordSaving(true);
    try {
      await profileService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showSuccess('Đổi mật khẩu thành công.');
      resetPasswordForm();
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Vui lòng chọn tập tin hình ảnh hợp lệ.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('Ảnh phải nhỏ hơn hoặc bằng 5MB.');
      return;
    }

    setAvatarUploading(true);
    try {
      const response = await profileService.uploadAvatar(file);
      updateUser({ ...user, avatar: response.avatar });
      showSuccess('Đã cập nhật ảnh đại diện.');
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể tải ảnh đại diện.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await profileService.deleteAccount();
      showSuccess('Đã xóa tài khoản.');
      logout();
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể xóa tài khoản.');
    }
    setDeleteLoading(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="profile">
      <PageHeader
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin nhận diện, bảo mật và quyền truy cập của bạn."
        breadcrumb={<span className="profile__breadcrumb">Tài khoản</span>}
      />

      <Card className="profile__section profile__identity" elevated>
        <div className="profile__identity-avatar">
          <Avatar src={user?.avatar ? `${API_URL}${user.avatar}` : null} name={user?.name} size="xl" />
          <div className="profile__identity-meta">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className={`profile__role profile__role--${user?.role === 'admin' ? 'admin' : 'member'}`}>
              {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
            </span>
          </div>
        </div>
        <label className="profile__upload">
          <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={avatarUploading} />
          <span>{avatarUploading ? 'Đang tải ảnh...' : 'Tải ảnh đại diện mới'}</span>
          <small>Kích thước tối đa 5MB · JPG hoặc PNG</small>
        </label>
      </Card>

      <Card className="profile__section">
        <div className="profile__section-header">
          <h2>Thông tin liên hệ</h2>
          <p>Cập nhật họ tên và email để hệ thống liên lạc chính xác.</p>
        </div>
        <form className="profile__form" onSubmit={handleProfileUpdate} noValidate>
          <Field error={profileErrors.name} required>
            <Field.Label>Họ và tên</Field.Label>
            <Field.Control>
              <Input
              value={profileData.name}
                onChange={(event) => setProfileData({ ...profileData, name: event.target.value })}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
              />
            </Field.Control>
            <Field.Message>{profileErrors.name}</Field.Message>
          </Field>

          <Field error={profileErrors.email} required>
            <Field.Label>Email</Field.Label>
            <Field.Control>
              <Input
              type="email"
              value={profileData.email}
                onChange={(event) => setProfileData({ ...profileData, email: event.target.value })}
                placeholder="ban@example.com"
                autoComplete="email"
              />
            </Field.Control>
            <Field.Message>{profileErrors.email}</Field.Message>
          </Field>

          <div className="profile__actions">
            <Button type="button" variant="outline" onClick={resetProfileForm} disabled={profileSaving}>
              Đặt lại
            </Button>
            <Button type="submit" variant="primary" loading={profileSaving}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Card>

      <Card className="profile__section">
        <div className="profile__section-header">
          <h2>Bảo mật tài khoản</h2>
          <p>Sử dụng mật khẩu mạnh và thay đổi định kỳ để giảm rủi ro.</p>
      </div>
        <form className="profile__form" onSubmit={handlePasswordChange} noValidate>
          <Field error={passwordErrors.currentPassword} required>
            <Field.Label>Mật khẩu hiện tại</Field.Label>
            <Field.Control>
              <PasswordInput
              value={passwordData.currentPassword}
                onChange={(event) => setPasswordData({ ...passwordData, currentPassword: event.target.value })}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </Field.Control>
            <Field.Message>{passwordErrors.currentPassword}</Field.Message>
          </Field>

          <Field error={passwordErrors.newPassword} required>
            <Field.Label>Mật khẩu mới</Field.Label>
            <Field.Control>
              <PasswordInput
              value={passwordData.newPassword}
                onChange={(event) => setPasswordData({ ...passwordData, newPassword: event.target.value })}
                autoComplete="new-password"
                placeholder="Tối thiểu 6 ký tự"
              />
            </Field.Control>
            <PasswordStrength password={passwordData.newPassword} />
            <Field.Message>{passwordErrors.newPassword}</Field.Message>
          </Field>

          <Field error={passwordErrors.confirmPassword} required>
            <Field.Label>Nhập lại mật khẩu</Field.Label>
            <Field.Control>
              <PasswordInput
              value={passwordData.confirmPassword}
                onChange={(event) => setPasswordData({ ...passwordData, confirmPassword: event.target.value })}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
              />
            </Field.Control>
            <Field.Message>{passwordErrors.confirmPassword}</Field.Message>
          </Field>

          <div className="profile__actions">
            <Button type="button" variant="outline" onClick={resetPasswordForm} disabled={passwordSaving}>
              Xóa nhập
            </Button>
            <Button type="submit" variant="primary" loading={passwordSaving}>
              Cập nhật mật khẩu
            </Button>
          </div>
        </form>
      </Card>

      <Card className="profile__section profile__section--danger">
        <div className="profile__section-header">
          <h2>Vùng nguy hiểm</h2>
          <p>Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa khỏi hệ thống.</p>
        </div>
        <div className="profile__danger">
          <div>
            <h3>Xóa tài khoản</h3>
            <p>
              Bạn sẽ bị đăng xuất ngay lập tức và cần liên hệ quản trị viên nếu muốn kích hoạt lại tài khoản.
            </p>
          </div>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Xóa tài khoản
          </Button>
      </div>
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Xác nhận xóa tài khoản">
        <div className="profile__modal">
          <p>
            Bạn chắc chắn muốn xóa tài khoản này? Hành động sẽ xóa toàn bộ dữ liệu và không thể khôi phục.
          </p>
          <div className="profile__modal-actions">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} block disabled={deleteLoading}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} block loading={deleteLoading}>
              Xóa tài khoản
            </Button>
          </div>
      </div>
      </Modal>
    </div>
  );
};

export default Profile;

