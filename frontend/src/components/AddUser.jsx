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
  );
}
