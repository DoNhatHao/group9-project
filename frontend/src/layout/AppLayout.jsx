import React, { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SidebarNotifications from '../components/SidebarNotifications';
import './AppLayout.css';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Tổng quan',
    description: 'Theo dõi trạng thái tài khoản và hành động nhanh.',
    icon: 'grid',
  },
  {
    to: '/profile',
    label: 'Hồ sơ',
    description: 'Quản lý thông tin cá nhân, bảo mật và quyền truy cập.',
    icon: 'user',
  },
];

const ADMIN_ITEM = {
  to: '/admin',
  label: 'Quản trị',
  description: 'Quản lý thành viên, vai trò và số liệu hệ thống.',
  icon: 'shield',
};

const Icon = ({ name }) => {
  switch (name) {
    case 'grid':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="13" y="3" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="3" y="13" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="13" y="13" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3l7 2v6c0 5-3.4 9.5-7 11-3.6-1.5-7-6-7-11V5l7-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 12l2.5 2.5L15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0-5.5l1 2.8a7.1 7.1 0 0 1 1.8 0l1-2.8 2.4 1.4-1 2.6a7.1 7.1 0 0 1 1.3 1.3l2.6-1 1.4 2.4-2.8 1a7.1 7.1 0 0 1 0 1.8l2.8 1-1.4 2.4-2.6-1a7.1 7.1 0 0 1-1.3 1.3l1 2.6-2.4 1.4-1-2.8a7.1 7.1 0 0 1-1.8 0l-1 2.8-2.4-1.4 1-2.6a7.1 7.1 0 0 1-1.3-1.3l-2.6 1-1.4-2.4 2.8-1a7.1 7.1 0 0 1 0-1.8l-2.8-1 1.4-2.4 2.6 1a7.1 7.1 0 0 1 1.3-1.3l-1-2.6 2.4-1.4z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'help':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11.5 16h1v-1h-1z" fill="currentColor" />
          <path
            d="M12 13.5v-.4c0-.9.5-1.4 1.2-1.9.7-.4 1.2-1 1.2-1.8 0-1.3-1.1-2.2-2.4-2.2-1.1 0-2 .6-2.3 1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
};

const AppLayout = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = useMemo(() => {
    return isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;
  }, [isAdmin]);

  const roleLabel = user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên';

  const activeRoute = navigation.find((item) => location.pathname.startsWith(item.to));

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  if (!user) {
    return children;
  }

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="app-sidebar" data-open={sidebarOpen}>
        <Link to="/dashboard" className="sidebar-brand" aria-label="Về trang tổng quan" onClick={closeSidebar}>
          <div className="brand-copy">
            <span className="brand-title">Group9-project</span>
            <span className="brand-subtitle">Quản lý người dùng</span>
          </div>
        </Link>

        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="sidebar-icon" aria-hidden="true">
                <Icon name={item.icon} />
              </span>
              <span className="sidebar-text">
                <span className="sidebar-label">{item.label}</span>
                <span className="sidebar-description">{item.description}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <SidebarNotifications className="sidebar-notifications-widget" />

        <div className="sidebar-spacer" aria-hidden="true" />

        <div className="sidebar-status surface-card" data-elevated="true">
          <span className="status-eyebrow">Phiên làm việc</span>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <div className="status-badge">
            {roleLabel}
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="app-sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />}

      <div className="app-main">
        <Navbar
          pageTitle={activeRoute?.label ?? 'Tổng quan'}
          onMenuClick={toggleSidebar}
        />

        <main id="main-content" className="app-content" role="main" tabIndex="-1">
          <div className="app-content-inner">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

