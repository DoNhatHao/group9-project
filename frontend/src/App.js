import React, { useState, useEffect } from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
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
    // Chỉ cập nhật state, không cần confirm/alert vì đã có trong Dashboard
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
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
              ← Quay Lại Trang Chủ
            </button>
            <button onClick={handleLogout} className="btn-logout-small">
              Đăng Xuất
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
              <h2>Truy Cập Bị Từ Chối</h2>
              <p>Bạn không có quyền truy cập trang này.</p>
              <button onClick={() => setCurrentView('dashboard')} className="btn btn-primary">
                Quay Lại Trang Chủ
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

  // If not authenticated, show Login or SignUp or ForgotPassword or ResetPassword
  if (showForgotPassword) {
    return (
      <div className="App">
        <ForgotPassword 
          onBack={() => {
            setShowForgotPassword(false);
            setShowSignUp(false);
          }}
        />
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className="App">
        <ResetPassword 
          onBack={() => {
            setShowResetPassword(false);
            setShowSignUp(false);
          }}
          onSuccess={() => {
            setShowResetPassword(false);
            setShowSignUp(false);
          }}
        />
      </div>
    );
  }

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
          onForgotPassword={() => setShowForgotPassword(true)}
          onResetPassword={() => setShowResetPassword(true)}
        />
      )}
    </div>
  );
}
