import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Avatar, StatCard, PageHeader, Skeleton, Button } from '../components/ui';
import './Dashboard.css';

const StatIcon = ({ name }) => {
  switch (name) {
    case 'health':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 12h3l2 3 4-6 2 3h5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M5 5h14v14H5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'security':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3l7 2v6c0 5-3.6 9.5-7 11-3.4-1.5-7-6-7-11V5l7-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

const ActivityIcon = ({ name }) => {
  switch (name) {
    case 'login':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 5H5v14h4M14 16l4-4-4-4M18 12H9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'update':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M19 7v6a6 6 0 11-2-4.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M19 5l-2 2 2 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'password':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="10" width="16" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 10V7a4 4 0 118 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    default:
      return null;
  }
};

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHydrating(false), 260);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date) =>
    date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const profileCompletion = user?.avatar ? 100 : 70;

  const statCards = [
    {
      id: 'health',
      icon: <StatIcon name="health" />,
      value: 'Ổn định',
      label: 'Trạng thái tài khoản',
      trend: 2,
      trendDirection: 'up',
      sparkline: [68, 70, 72, 73, 74, 75],
    },
    {
      id: 'profile',
      icon: <StatIcon name="profile" />,
      value: `${profileCompletion}%`,
      label: 'Hoàn thiện hồ sơ',
      trend: profileCompletion === 100 ? 0 : 18,
      trendDirection: 'up',
      sparkline: [40, 48, 52, 60, profileCompletion, profileCompletion],
    },
    {
      id: 'security',
      icon: <StatIcon name="security" />,
      value: 'Cao',
      label: 'Mức độ bảo mật',
      trend: 12,
      trendDirection: 'up',
      sparkline: [55, 58, 62, 69, 72, 78],
    },
  ];

  const recentActivities = [
    { id: 1, icon: 'login', title: 'Đăng nhập hệ thống', time: '2 phút trước' },
    { id: 2, icon: 'update', title: 'Cập nhật thông tin hồ sơ', time: '58 phút trước' },
    { id: 3, icon: 'password', title: 'Đổi mật khẩu', time: '3 ngày trước' },
  ];

  return (
    <div className="dashboard">
      <PageHeader
        title="Tổng quan"
        subtitle="Theo dõi sức khỏe tài khoản, lối tắt và hoạt động gần đây."
        breadcrumb={<span className="dashboard__breadcrumb">Không gian làm việc</span>}
        actions={
          <>
            <Button as={Link} to="/landing-preview" variant="link">
              Xem trang giới thiệu
            </Button>
            <Button as={Link} to="/profile" variant="outline">
              Quản lý hồ sơ
            </Button>
          </>
        }
      >
        <div className="dashboard__welcome">
          <div>
            <p className="dashboard__eyebrow">Chào mừng trở lại</p>
            <h2>
              {user?.name || 'Thành viên'} - {formatDate(currentTime)} - {formatTime(currentTime)}
            </h2>
          </div>
          <Avatar src={user?.avatar ? `http://localhost:3000${user.avatar}` : null} name={user?.name} size="lg" />
        </div>
      </PageHeader>

      <div className="dashboard__stats">
        {hydrating
          ? statCards.map((card) => (
              <Card key={card.id} className="dashboard__stat-skeleton">
                <Skeleton height="1.4rem" width="30%" />
                <Skeleton height="2rem" width="40%" style={{ marginTop: '0.75rem' }} />
                <Skeleton height="0.9rem" width="60%" style={{ marginTop: '0.5rem' }} />
              </Card>
            ))
          : statCards.map((card) => <StatCard key={card.id} {...card} />)}
      </div>

      <div className="dashboard__grid">
        <Card className="dashboard__account">
          <div className="dashboard__section-header">
            <h3>Thông tin tài khoản</h3>
            <Button as={Link} to="/profile" variant="link">
              Chỉnh sửa hồ sơ
            </Button>
          </div>
          <div className="dashboard__account-body">
            <Avatar src={user?.avatar ? `http://localhost:3000${user.avatar}` : null} name={user?.name} size="xl" />
            <dl>
              <div>
                <dt>Họ tên</dt>
                <dd>{user?.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user?.email}</dd>
              </div>
              <div>
                <dt>Vai trò</dt>
                <dd className={`dashboard__role dashboard__role--${user?.role === 'admin' ? 'admin' : 'member'}`}>
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card className="dashboard__shortcuts">
          <div className="dashboard__section-header">
            <h3>Thao tác nhanh</h3>
          </div>
          <div className="dashboard__shortcuts-grid">
            <Link to="/profile" className="dashboard__shortcut">
              <span>Cập nhật hồ sơ</span>
              <small>Giữ thông tin cá nhân luôn chính xác.</small>
            </Link>
            <Link to="/profile" className="dashboard__shortcut">
              <span>Đổi mật khẩu</span>
              <small>Tăng cường bảo mật cho tài khoản.</small>
            </Link>
            <Link to="/profile" className="dashboard__shortcut">
              <span>Đổi ảnh đại diện</span>
              <small>Giúp đồng đội nhận ra bạn nhanh hơn.</small>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="dashboard__shortcut dashboard__shortcut--highlight">
                <span>Mở trang quản trị</span>
                <small>Quản lý người dùng và phân quyền.</small>
              </Link>
            )}
          </div>
        </Card>
      </div>

      <Card className="dashboard__activity">
        <div className="dashboard__section-header">
          <h3>Hoạt động gần đây</h3>
        </div>
        <div className="dashboard__timeline">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="dashboard__timeline-item">
              <div className="dashboard__timeline-icon">
                <ActivityIcon name={activity.icon} />
              </div>
              <div>
                <p className="dashboard__timeline-title">{activity.title}</p>
                <p className="dashboard__timeline-time">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

