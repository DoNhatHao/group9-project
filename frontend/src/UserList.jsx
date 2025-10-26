import { useState, useEffect } from "react";
import { api } from "./api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (!window.confirm("Xóa user này?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Lỗi xóa user: " + (err.message || ""));
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
            <li key={user._id}>
              <div>
                <strong>{user.name}</strong>
                <br />
                <small>{user.email}</small>
              </div>
              <button onClick={() => deleteUser(user._id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
