import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onMenuClick, pageTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) {
      return '?';
    }
    const parts = user.name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }, [user?.name]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMenuToggle = () => {
    if (typeof onMenuClick === 'function') {
      onMenuClick();
    }
  };

  const roleLabel = user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên';

  return (
    <header className="topbar surface-card" data-elevated="true">
      <div className="topbar-left">
        <button
          type="button"
          className="menu-trigger focus-ring"
          onClick={handleMenuToggle}
          aria-label="Mở thanh điều hướng"
        >
          <span aria-hidden />
          <span aria-hidden />
          <span aria-hidden />
        </button>

        <div className="topbar-heading">
          <h1 className="topbar-title">
            <span className="topbar-title-root">Group9 Console</span>
            <span className="topbar-title-separator" aria-hidden="true">·</span>
            <span className="topbar-title-current">{pageTitle}</span>
          </h1>
        </div>

        <div className="topbar-search" role="search">
          <span className="topbar-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="6" />
              <path d="m16.5 16.5 3 3" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm..."
            aria-label="Tìm kiếm"
          />
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-actions" role="group" aria-label="Liên kết nhanh">
          <button type="button" className="topbar-icon" aria-label="Trợ giúp" title="Trợ giúp">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M12 14v-.4c0-.9.5-1.4 1.2-1.9.7-.4 1.2-1 1.2-1.8 0-1.3-1.1-2.2-2.4-2.2-1.1 0-2 .6-2.3 1.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="17" r="0.9" fill="currentColor" />
            </svg>
          </button>
          <button type="button" className="topbar-icon" aria-label="Liên hệ" title="Liên hệ">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M5 7l7 5 7-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="user-menu" ref={menuRef}>
          <button
            type="button"
            className="user-chip focus-ring"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            {user?.avatar ? (
              <img src={`http://localhost:3000${user.avatar}`} alt={user.name} />
            ) : (
              <span className="user-chip-initials" aria-hidden>
                {initials}
              </span>
            )}
            <span className="user-chip-name">{user?.name}</span>
            <span className={`user-chip-caret ${menuOpen ? 'open' : ''}`} aria-hidden>
              ◢
            </span>
          </button>

          {menuOpen && (
            <div className="user-popover" role="menu">
              <div className="user-popover-header">
                <div className="user-popover-info">
                  <span className="user-popover-name">{user?.name}</span>
                  <span className="user-popover-email">{user?.email}</span>
                </div>
                <span className="user-popover-role">{roleLabel}</span>
              </div>
              <div className="user-popover-actions">
                <button
                  type="button"
                  className="user-popover-item"
                  onClick={() => {
                    navigate('/dashboard');
                    setMenuOpen(false);
                  }}
                >
                  Tổng quan
                </button>
                <button
                  type="button"
                  className="user-popover-item"
                  onClick={() => {
                    navigate('/profile');
                    setMenuOpen(false);
                  }}
                >
                  Hồ sơ
                </button>
              </div>
              <button
                type="button"
                className="user-popover-item user-popover-logout"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

