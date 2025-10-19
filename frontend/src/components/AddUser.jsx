import React, { useState } from 'react';
import api from '../api';

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
  await api.post('/users', newUser);
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
  );
}
