import React, { useEffect, useMemo, useState } from 'react';
import activityService from '../services/activityService';
import './SidebarNotifications.css';

const ICONS = {
  login: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4h7v16h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12H3m4-4-4 4 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4h7v16h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12h12m-4 4 4-4-4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  profile_update: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 21c.3-3.9 3.6-7 8-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 17h5m0 0-2 2m2-2-2-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  password_change: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 15v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  password_reset_request: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a9.94 9.94 0 0 1 7.07 2.93L19 5M12 22a9.94 9.94 0 0 1-7.07-2.93L5 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 8v4l2.5 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  password_reset_complete: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12.5 2.5 2.5 4.5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  avatar_update: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 20c0-3.3 3.1-6 7-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m19 20 2-2m0 0-2-2m2 2h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  account_created: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 10h8m-8 4h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M17 7v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 9h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) {
    return '';
  }

  const now = Date.now();
  const date = new Date(timestamp).getTime();
  const diff = now - date;

  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  if (diff < MINUTE) {
    return 'Vừa xong';
  }
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} phút trước`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} giờ trước`;
  }
  const days = Math.floor(diff / DAY);
  return `${days} ngày trước`;
};

const SidebarNotifications = ({ limit = 5, className = '' }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await activityService.getMyActivities(limit);
        if (!mounted) {
          return;
        }
        setActivities(data.activities ?? []);
      } catch (error) {
        if (mounted) {
          setActivities([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    const interval = setInterval(fetchActivities, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [limit]);

  const renderedActivities = useMemo(() => activities.slice(0, limit), [activities, limit]);

  return (
    <section className={`sidebar-notifications ${className}`.trim()} aria-live="polite">
      <header className="sidebar-notifications__header">
        <h2>Hoạt động gần đây</h2>
        {loading && <span className="sidebar-notifications__badge">Đang tải...</span>}
      </header>

      {renderedActivities.length === 0 && !loading ? (
        <p className="sidebar-notifications__empty">Chưa có hoạt động nào.</p>
      ) : (
        <ul className="sidebar-notifications__list">
          {renderedActivities.map((activity) => {
            const icon = ICONS[activity.type] ?? ICONS.account_created;

            return (
              <li key={activity._id} className="sidebar-notifications__item">
                <span className={`sidebar-notifications__icon sidebar-notifications__icon--${activity.type}`} aria-hidden="true">
                  {icon}
                </span>
                <div className="sidebar-notifications__content">
                  <p className="sidebar-notifications__description">{activity.description}</p>
                  <span className="sidebar-notifications__time">{formatRelativeTime(activity.timestamp)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default SidebarNotifications;
