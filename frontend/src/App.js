import AddUser from "./AddUser";
import UserList from "./UserList";
import "./styles.css";

export default function App() {
  // Backend team: Đã hoàn thành API CRUD đầy đủ
  // Kết nối: http://localhost:3001/users
  const handleAdded = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      <h1>Group 9 Project – User Management</h1>
      <AddUser onAdded={handleAdded} />
      <UserList />
    </div>
  );
}
