import { useEffect, useState } from "react";
import { api } from "../api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null); // {id, name, email}

  const fetchUsers = async () => {
    const { data } = await api.get("/api/users"); // ← đổi thành "/users" nếu backend không có /api
    setUsers(data || []);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    await api.delete(`/api/users/${id}`);        // ← đổi tuỳ prefix
    setUsers(prev => prev.filter(x => (x._id || x.id) !== id));
  };

  const handleEdit = (u) => setEditing({ id: u._id || u.id, name: u.name, email: u.email });

  const submitEdit = async (e) => {
    e.preventDefault();
    const { id, name, email } = editing;
    await api.put(`/api/users/${id}`, { name, email }); // ← đổi tuỳ prefix
    setEditing(null);
    fetchUsers();
  };

  return (
    <div className="list">
      {editing && (
        <form className="edit-form" onSubmit={submitEdit}>
          <input value={editing.name} onChange={e => setEditing(s => ({ ...s, name: e.target.value }))}/>
          <input value={editing.email} onChange={e => setEditing(s => ({ ...s, email: e.target.value }))}/>
          <div>
            <button type="submit">Cập nhật</button>
            <button type="button" onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </form>
      )}

      {users.map(u => (
        <div className="item" key={u._id || u.id}>
          <div style={{ flex: 1 }}>
            <strong>{u.name}</strong> — {u.email}
          </div>
          <button onClick={() => handleEdit(u)}>Sửa</button>
          <button onClick={() => handleDelete(u._id || u.id)}>Xóa</button>
        </div>
      ))}
    </div>
  );
}
