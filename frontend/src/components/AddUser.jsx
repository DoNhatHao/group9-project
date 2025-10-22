<<<<<<< HEAD
import React, { useState } from 'react';
import axios from 'axios';

export default function AddUser({ onAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newUser = { name, email };
      await axios.post('http://localhost:3000/users', newUser);
      setName('');
      setEmail('');
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Thêm user</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Đang thêm...' : 'Thêm'}</button>
        {error && <div style={{color: 'red'}}>{error}</div>}
      </form>
    </div>
=======
import { useState } from "react";
import { api } from "../api";

export default function AddUser({ onAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Tên không được trống");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Email không hợp lệ");

    // Nếu backend có prefix:
    await api.post("/api/users", { name, email }); // ← đổi thành "/users" nếu backend không có /api

    setName(""); setEmail("");
    onAdded?.();
  };

  return (
    <form className="panel" onSubmit={submit}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit">Thêm User</button>
    </form>
>>>>>>> feature/frontend-mongodb
  );
}
