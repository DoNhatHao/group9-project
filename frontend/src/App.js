import './App.css';
import React, { useRef } from 'react';
import UserList from './components/UserList';
import AddUser from './components/AddUser';

function App() {
  const listRef = useRef();

  return (
    <div className="App" style={{padding: '20px'}}>
      <h1>Frontend - User Manager</h1>
      <AddUser onAdded={() => { if (listRef.current && listRef.current.fetchUsers) listRef.current.fetchUsers(); window.location.reload(); }} />
      <hr />
      <UserList ref={listRef} />
    </div>
  );
}

export default App;
