import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Button, Badge, Card, StatCard, Avatar, Modal, Input, PageHeader, Skeleton, Field, PasswordInput } from '../../components/ui';
import { showError, showSuccess } from '../../utils/toast';
import './AdminDashboard.css';

const AdminIcon = ({ name }) => {
  switch (name) {
    case 'users':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 20v-1a4 4 0 014-4h6a4 4 0 014 4v1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'active':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 12h5l2 4 4-8 2 4h5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'admins':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l7 4v6c0 5-3.5 9.5-7 11-3.5-1.5-7-6-7-11V6l7-4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const [createModal, setCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const usersPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = users;

    if (searchQuery) {
      result = result.filter((user) => {
        const query = searchQuery.toLowerCase();
        return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
      });
    }

    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchQuery, roleFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([adminService.getAllUsers(), adminService.getStats()]);
      setUsers(usersData.users);
      setFilteredUsers(usersData.users);
      setStats(statsData.stats);
    } catch (error) {
      showError('Không thể tải dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setDeleteLoading(true);
    try {
      await adminService.deleteUser(deleteModal.user.id);
      showSuccess('Đã xóa người dùng.');
      fetchData();
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể xóa người dùng.');
    }
    setDeleteLoading(false);
    setDeleteModal({ isOpen: false, user: null });
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const openEditModal = (user) => {
    setEditForm({ name: user.name, email: user.email, role: user.role, password: '' });
    setEditModal({ isOpen: true, user });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editModal.user) return;
    setEditLoading(true);
    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      };
      if (editForm.password) {
        updateData.password = editForm.password;
      }
      await adminService.updateUser(editModal.user.id, updateData);
      showSuccess('Đã cập nhật người dùng.');
      fetchData();
      setEditModal({ isOpen: false, user: null });
      setEditForm({ name: '', email: '', role: 'user', password: '' });
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể cập nhật người dùng.');
    }
    setEditLoading(false);
  };

  const openCreateModal = () => {
    setCreateForm({ name: '', email: '', password: '', role: 'user' });
    setCreateModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await adminService.createUser(createForm);
      showSuccess('Đã tạo người dùng mới.');
      fetchData();
      setCreateModal(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user' });
    } catch (error) {
      showError(error.response?.data?.message || 'Không thể tạo người dùng.');
    }
    setCreateLoading(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfLastUser - usersPerPage, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;

  return (
    <div className="admin">
      <PageHeader
        title="Bảng điều khiển quản trị"
        subtitle="Giám sát người dùng, phân quyền và sức khỏe hệ thống."
        breadcrumb={<span className="admin__breadcrumb">Quản trị</span>}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Button variant="primary" onClick={openCreateModal}>
              Thêm người dùng
            </Button>
            <Button variant="outline" onClick={fetchData} loading={loading}>
              Tải lại dữ liệu
            </Button>
          </div>
        }
      />

      <div className="admin__stats">
        {loading || !stats ? (
          [1, 2, 3].map((item) => (
            <Card key={item} className="admin__stat-card">
              <Skeleton height="1.2rem" width="36%" />
              <Skeleton height="2.1rem" width="48%" style={{ marginTop: '0.85rem' }} />
              <Skeleton height="0.9rem" width="54%" style={{ marginTop: '0.5rem' }} />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              icon={<AdminIcon name="users" />}
              value={stats.totalUsers}
              label="Tổng người dùng"
              trend={8}
              trendDirection="up"
            />
            <StatCard
              icon={<AdminIcon name="active" />}
              value={stats.regularUsers}
              label="Người dùng hoạt động"
              trend={5}
              trendDirection="up"
            />
            <StatCard
              icon={<AdminIcon name="admins" />}
              value={stats.adminUsers}
              label="Quản trị viên"
              trend={2}
              trendDirection="up"
            />
          </>
        )}
          </div>

      <Card className="admin__panel" elevated>
        <div className="admin__panel-header">
          <div>
            <h2>Danh sách người dùng</h2>
            <p>{filteredUsers.length} người phù hợp với bộ lọc hiện tại.</p>
          </div>
          <div className="admin__filters">
            <Input
              type="search"
              placeholder="Tìm theo tên hoặc email"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter by role">
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Thành viên</option>
            </select>
            <Button variant="ghost" onClick={clearFilters}>
              Xóa lọc
            </Button>
          </div>
        </div>

        <div className="admin__table-wrapper">
          <table className="admin__table">
          <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td colSpan={5} className="admin__loading-row">
                      <Skeleton height="1.05rem" width="40%" />
                      <Skeleton height="0.9rem" width="65%" style={{ marginTop: '0.35rem' }} />
                    </td>
                  </tr>
                ))
              ) : currentUsers.length > 0 ? (
                currentUsers.map((member) => (
                  <tr key={member.id}>
                    <td data-label="Họ tên">
                      <div className="admin__user">
                        <Avatar
                          src={member.avatar ? `http://localhost:3000${member.avatar}` : null}
                          name={member.name}
                          size="sm"
                        />
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td data-label="Email" className="admin__email">{member.email}</td>
                    <td data-label="Vai trò">
                      <Badge variant={member.role === 'admin' ? 'warning' : 'default'}>
                        {member.role === 'admin' ? 'Quản trị' : 'Thành viên'}
                  </Badge>
                </td>
                    <td data-label="Ngày tham gia">{new Date(member.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td data-label="Hành động">
                      <div className="admin__row-actions">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(member)}>
                          Chỉnh sửa
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteModal(member)}>
                          Xóa
                        </Button>
                      </div>
                </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="admin__empty">
                    {searchQuery || roleFilter !== 'all'
                      ? 'Không có người dùng nào khớp với bộ lọc.'
                      : 'Chưa có người dùng nào trong hệ thống.'}
                </td>
              </tr>
              )}
          </tbody>
        </table>
      </div>

        {totalPages > 1 && (
          <div className="admin__pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        title="Xóa người dùng"
      >
        <div className="admin__modal">
          <p>
            Bạn sắp xóa <strong>{deleteModal.user?.name}</strong> khỏi workspace. Hành động này không thể hoàn tác.
          </p>
          <div className="admin__modal-actions">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, user: null })}
              block
              disabled={deleteLoading}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete} block loading={deleteLoading}>
              Xóa người dùng
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        title="Chỉnh sửa người dùng"
      >
        <form className="admin__form" onSubmit={handleEdit}>
          <Field>
            <Field.Label htmlFor="edit-name">Họ và tên</Field.Label>
            <Field.Control>
              <Input
                id="edit-name"
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </Field.Control>
          </Field>

          <Field>
            <Field.Label htmlFor="edit-email">Email</Field.Label>
            <Field.Control>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </Field.Control>
          </Field>

          <Field>
            <Field.Label htmlFor="edit-role">Vai trò</Field.Label>
            <Field.Control>
              <select
                id="edit-role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="admin__select"
              >
                <option value="user">Thành viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </Field.Control>
          </Field>

          <Field>
            <Field.Label htmlFor="edit-password">Mật khẩu mới (để trống nếu không đổi)</Field.Label>
            <Field.Control>
              <PasswordInput
                id="edit-password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="Nhập mật khẩu mới"
              />
            </Field.Control>
            <Field.Description>Chỉ nhập nếu muốn thay đổi mật khẩu</Field.Description>
          </Field>

          <div className="admin__modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditModal({ isOpen: false, user: null })}
              block
              disabled={editLoading}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" block loading={editLoading}>
              Cập nhật
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Thêm người dùng mới"
      >
        <form className="admin__form" onSubmit={handleCreate}>
          <Field>
            <Field.Label htmlFor="create-name">Họ và tên</Field.Label>
            <Field.Control>
              <Input
                id="create-name"
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
              />
            </Field.Control>
          </Field>

          <Field>
            <Field.Label htmlFor="create-email">Email</Field.Label>
            <Field.Control>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                required
              />
            </Field.Control>
          </Field>

          <Field>
            <Field.Label htmlFor="create-password">Mật khẩu</Field.Label>
            <Field.Control>
              <PasswordInput
                id="create-password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Nhập mật khẩu"
                required
              />
            </Field.Control>
          </Field>

          <Field>
            <Field.Label htmlFor="create-role">Vai trò</Field.Label>
            <Field.Control>
              <select
                id="create-role"
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className="admin__select"
              >
                <option value="user">Thành viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </Field.Control>
          </Field>

          <div className="admin__modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModal(false)}
              block
              disabled={createLoading}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" block loading={createLoading}>
              Tạo người dùng
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

