import { useEffect, useState } from 'react';
import { api } from "../api";
import { showError, showSuccess, showConfirm } from './utils/toast';

const UserList = ({ onEditUser, onUserCountChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users"); // Sử dụng api thay vì axios và API_ENDPOINTS
      setUsers(res.data);
      if (onUserCountChange) {
        onUserCountChange(res.data.length);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng', err);
      showError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = await showConfirm(`Bạn có chắc muốn xóa người dùng "${name}"?`);
    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`); // Sử dụng api thay vì axios và API_ENDPOINTS
      setUsers(users.filter(user => user._id !== id));
      showSuccess(`Đã xóa người dùng "${name}"`);
      if (onUserCountChange) {
        onUserCountChange(users.length - 1);
      }
    } catch (err) {
      console.error('Lỗi khi xóa người dùng', err);
      showError('Không thể xóa người dùng');
    }
  };

  // Xử lý sự kiện Sửa - Hiển thị form với dữ liệu người dùng đã chọn
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
  };

  // Gửi PUT request đến backend để cập nhật
  const saveEdit = async (id) => {
    // Validation
    if (!editName.trim()) {
      showError("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editEmail)) {
      showError("Email không hợp lệ");
      return;
    }

    try {
      const res = await api.put(`/users/${id}`, {
        name: editName,
        email: editEmail
      });
      setUsers(users.map(u => u._id === id ? res.data : u));
      cancelEdit();
      showSuccess("Cập nhật user thành công!");
      if (onUserCountChange) {
        onUserCountChange(users.length);
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật người dùng', err);
      showError("Không thể cập nhật người dùng");
    }
  };

  if (loading) {
    return <div className="panel">Đang tải danh sách người dùng...</div>;
  }

  return (
    <div className="panel">
      <h2>Danh sách User ({users.length})</h2>
      {users.length === 0 ? (
        <p>Chưa có user nào. Hãy thêm user mới!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                {editingUser === user._id ? (
                  // Form sửa inline
                  <>
                    <td>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Tên"
                      />
                    </td>
                    <td>
                      <input 
                        type="email" 
                        value={editEmail} 
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </td>
                    <td>
                      <button onClick={() => saveEdit(user._id)}>Lưu</button>
                      <button onClick={cancelEdit}>Hủy</button>
                    </td>
                  </>
                ) : (
                  // Hiển thị thông tin user
                  <>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleEdit(user)}>Sửa</button>
                      <button onClick={() => handleDelete(user._id, user.name)}>Xóa</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;