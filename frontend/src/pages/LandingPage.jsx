import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, FeatureCard } from '../components/ui';
import './LandingPage.css';

const FeatureIcon = ({ name }) => {
  switch (name) {
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
          <path d="M9 12l2.5 2.5L15 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'experience':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 4h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="4" y="9" width="16" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="14.5" r="1.5" fill="currentColor" />
          <path d="M12 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'operations':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h6l2 3h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 12h7l2 3h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 18h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
};

const LandingPage = () => {
  const { user } = useAuth();
  const revealTargets = useRef(new Set());

  const registerReveal = useCallback((node) => {
    if (node) {
      revealTargets.current.add(node);
    }
  }, []);

  useEffect(() => {
    const elements = Array.from(revealTargets.current);
    if (!elements.length) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10%',
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" className="landing-nav__brand">
          Group9-project
        </Link>
        <div className="landing-nav__actions">
          {!user ? (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Đăng nhập
              </Button>
              <Button as={Link} to="/signup" variant="primary" size="sm">
                Đăng ký
              </Button>
            </>
          ) : (
            <Button as={Link} to="/dashboard" variant="primary" size="sm">
              Bảng điều khiển
            </Button>
          )}
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-hero__content" ref={registerReveal}>
            <span className="landing-hero__eyebrow">Hệ thống quản lý MERN</span>
            <h1 className="landing-hero__title">
              Quản lý người dùng chuyên nghiệp
            </h1>
            <p className="landing-hero__subtitle">
              Xác thực JWT, phân quyền RBAC, quản trị realtime và dashboard hoàn chỉnh.
            </p>
            <div className="landing-hero__actions">
              {!user ? (
                <>
                  <Button as={Link} to="/login" size="lg">
                    Truy cập hệ thống
                  </Button>
                  <Button as={Link} to="/signup" variant="outline" size="lg">
                    Tạo tài khoản
                  </Button>
                </>
              ) : (
                <Button as={Link} to="/dashboard" size="lg">
                  Vào bảng điều khiển
                </Button>
              )}
            </div>
          </div>
          <Card className="landing-hero__panel" elevated ref={registerReveal}>
            <header>
              <span>Thành viên nhóm</span>
            </header>
            <div className="landing-hero__member" ref={registerReveal}>
              <div className="member-avatar">H</div>
              <div className="member-info">
                <strong>Đỗ Nhật Hào</strong>
                <span className="member-id">MSSV: 224168</span>
              </div>
            </div>
            <div className="landing-hero__member" ref={registerReveal}>
              <div className="member-avatar">K</div>
              <div className="member-info">
                <strong>Nguyễn Hoàng Anh Kiệt</strong>
                <span className="member-id">MSSV: 226117</span>
              </div>
            </div>
            <div className="landing-hero__member" ref={registerReveal}>
              <div className="member-avatar">L</div>
              <div className="member-info">
                <strong>Trần Chí Linh</strong>
                <span className="member-id">MSSV: 221880</span>
              </div>
            </div>
          </Card>
        </section>

        <section className="landing-section">
          <header className="landing-section__header">
            <h2>Thiết kế cho đội ngũ mong muốn trải nghiệm hoàn thiện</h2>
            <p>
              Triển khai mọi luồng người dùng quan trọng: xác thực an toàn, hồ sơ tự phục vụ, phân quyền linh hoạt, báo cáo rõ ràng.
            </p>
          </header>
          <div className="landing-features">
            <FeatureCard
              icon={<FeatureIcon name="security" />}
              title="Xác thực bảo mật"
              description="Đăng ký/đăng nhập JWT, nhớ phiên, đăng xuất an toàn và cảnh báo sai mật khẩu ngay khi triển khai."
              ref={registerReveal}
            />
            <FeatureCard
              icon={<FeatureIcon name="experience" />}
              title="Quản lý hồ sơ chủ động"
              description="Cập nhật thông tin cá nhân, đổi mật khẩu, tải ảnh đại diện kèm chỉ báo độ mạnh và cảnh báo realtime."
              ref={registerReveal}
            />
            <FeatureCard
              icon={<FeatureIcon name="operations" />}
              title="Quản trị nâng cao"
              description="Bảng điều khiển admin với bộ lọc, tìm kiếm, phân quyền, bảng người dùng, phân trang và thống kê tăng trưởng."
              ref={registerReveal}
            />
          </div>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;
