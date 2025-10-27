import React, { useState, useEffect } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'profile', 'admin'

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
    // Hiển thị thông báo xác nhận
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (!confirmLogout) {
      return; // Hủy nếu user không confirm
    }

    // Xóa data và logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    
    // Thông báo thành công
    alert('Logout successful! See you again.');
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const toggleForm = () => {
    setShowSignUp(!showSignUp);
  };

  // If authenticated, show Dashboard or Profile
  if (isAuthenticated && currentUser) {
    if (currentView === 'profile') {
      return (
        <div className="App">
          <nav className="app-nav">
            <button onClick={() => setCurrentView('dashboard')} className="nav-link">
              ← Back to Dashboard
            </button>
            <button onClick={handleLogout} className="btn-logout-small">
              Logout
            </button>
          </nav>
          <Profile 
            user={currentUser} 
            onProfileUpdate={handleProfileUpdate}
            onLogout={handleLogout}
          />
        </div>
      );
    }
    
    if (currentView === 'admin') {
      // Chỉ admin mới được vào
      if (currentUser.role !== 'admin') {
        return (
          <div className="App">
            <div className="access-denied">
              <h2>Access Denied</h2>
              <p>You do not have permission to access this page.</p>
              <button onClick={() => setCurrentView('dashboard')} className="btn btn-primary">
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      }
      
      return (
        <div className="App">
          <AdminPanel 
            currentUser={currentUser}
            onBack={() => setCurrentView('dashboard')}
          />
        </div>
      );
    }
    
    return (
      <Dashboard 
        user={currentUser} 
        onLogout={handleLogout}
        onNavigateToProfile={() => setCurrentView('profile')}
        onNavigateToAdmin={() => setCurrentView('admin')}
      />
    );
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
