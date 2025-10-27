import { useState, useEffect } from "react";
import { api } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.message || "Lỗi tải danh sách user");
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      alert("Xóa user thành công!");
    } catch (err) {
      alert("Lỗi xóa user: " + (err.response?.data?.message || err.message));
    }
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditName("");
    setEditEmail("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      alert("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editEmail)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      const res = await api.put(`/users/${id}`, {
        name: editName,
        email: editEmail
      });
      setUsers(users.map(u => u._id === id ? res.data : u));
      cancelEdit();
      alert("Cập nhật user thành công!");
    } catch (err) {
      alert("Lỗi cập nhật user: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="panel">Đang tải...</div>;
  if (error) return <div className="panel error">❌ {error}</div>;

  return (
    <div className="panel">
      <h2>Danh sách Users ({users.length})</h2>
      {users.length === 0 ? (
        <p>Chưa có user nào</p>
      ) : (
        <ul className="user-list">
          {users.map(user => (
            <li key={user._id} className="user-item">
              {editingUser === user._id ? (
                <div className="edit-form">
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tên"
                  />
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email"
                  />
                  <div className="button-group">
                    <button onClick={() => saveEdit(user._id)} className="btn-save">Lưu</button>
                    <button onClick={cancelEdit} className="btn-cancel">Hủy</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <br />
                    <small>{user.email}</small>
                  </div>
                  <div className="button-group">
                    <button onClick={() => startEdit(user)} className="btn-edit">Sửa</button>
                    <button onClick={() => deleteUser(user._id)} className="btn-delete">Xóa</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
