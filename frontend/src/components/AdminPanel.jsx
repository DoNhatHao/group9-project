import React, { useState, useEffect } from 'react';
import { userAPI } from '../api';
import './AdminPanel.css';

const AdminPanel = ({ currentUser, onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  // Fetch users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await userAPI.getUsers();
      
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setError(
        err.response?.data?.message || 
        'Error fetching users. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    // Không cho xóa chính mình - currentUser có .id, user từ DB có ._id
    if (userId === currentUser.id) {
      alert('You cannot delete your own account from here. Use Profile page instead.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    setError('');
    setSuccess('');

    try {
      const response = await userAPI.deleteUser(userId);
      
      if (response.data.success) {
        setSuccess(`User "${userName}" deleted successfully!`);
        // Refresh danh sách
        fetchUsers();
        
        // Clear success message sau 3s
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError(
        err.response?.data?.message || 
        'Error deleting user. Please try again.'
      );
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editForm.name || !editForm.email) {
      setError('Name and email are required');
      return;
    }

    try {
      // Sử dụng _id thay vì id
      const response = await userAPI.updateUser(editingUser._id, editForm);
      
      if (response.data.success) {
        setSuccess(`User "${editForm.name}" updated successfully!`);
        setEditingUser(null);
        // Refresh danh sách
        fetchUsers();
        
        // Clear success message sau 3s
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Update user error:', err);
      setError(
        err.response?.data?.message || 
        'Error updating user. Please try again.'
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: 'user' });
    setError('');
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <button onClick={onBack} className="btn-back">
            ← Back to Dashboard
          </button>
          <h2>Admin Panel - User Management</h2>
        </div>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <button onClick={onBack} className="btn-back">
          ← Back to Dashboard
        </button>
        <h2>Admin Panel - User Management</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <div className="stat-value">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="stat-label">Regular Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-info">
            <div className="stat-value">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="stat-label">Admins</div>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-avatar-small">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder-small">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="user-name">
                  {user.name}
                  {user._id === currentUser.id && (
                    <span className="badge-you">You</span>
                  )}
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button 
                    onClick={() => handleEditClick(user)}
                    className="btn-action btn-edit"
                    title="Edit user"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="btn-action btn-delete"
                    disabled={user._id === currentUser.id}
                    title={user._id === currentUser.id ? "Cannot delete yourself" : "Delete user"}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            <p>No users found.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button onClick={handleCancelEdit} className="btn-close">×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="edit-name">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-role">Role</label>
                <select
                  id="edit-role"
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  disabled={editingUser._id === currentUser.id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {editingUser._id === currentUser.id && (
                  <small className="form-hint">You cannot change your own role</small>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
