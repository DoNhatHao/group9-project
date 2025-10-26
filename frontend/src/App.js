import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import "./styles.css";

export default function App() {
  // Cách đơn giản: không cần ref; UserList tự fetch sau khi mount,
  // còn AddUser gọi onAdded -> ta reload trang (nhanh-gọn), hoặc nâng cao thì dùng state nâng lên App.
  const handleAdded = () => {
    // Cách nhanh: reload nhẹ để danh sách refresh
    // (hoặc bạn có thể truyền state từ App xuống cả 2 component để không cần reload)
    window.location.reload();
  };

  return (
    <div className="app">
      <h1>Group Project – Frontend</h1>
      <AddUser onAdded={handleAdded} />
      <UserList />
    </div>
  );
}
