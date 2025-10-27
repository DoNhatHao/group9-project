import React, { useState, useEffect } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleSignUpSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const toggleForm = () => {
    setShowSignUp(!showSignUp);
  };

  // If authenticated, show Dashboard
  if (isAuthenticated && currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  // If not authenticated, show Login or SignUp
  return (
    <div className="App">
      {showSignUp ? (
        <SignUp 
          onToggleForm={toggleForm} 
          onSignUpSuccess={handleSignUpSuccess}
        />
      ) : (
        <Login 
          onToggleForm={toggleForm} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
