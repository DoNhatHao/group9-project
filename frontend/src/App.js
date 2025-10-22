import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import "./styles.css";

export default function App() {   // <-- export default BẮT BUỘC phải có
  const handleAdded = () => window.location.reload();

  return (
    <div className="app">
      <h1>Group Project – Frontend</h1>
      <AddUser onAdded={handleAdded} />
      <UserList />
    </div>
  );
}
