import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Lỗi khi lấy user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Danh sách user</h2>
      {users.length === 0 ? (
        <div>Không có user</div>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id || u._id}>{u.name} — {u.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
