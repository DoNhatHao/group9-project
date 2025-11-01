import React from 'react';
import './StatCard.css';

const StatCard = ({
  icon,
  value,
  label,
  trend,
  trendDirection,
  sparkline,
  className = '',
  ...props
}) => {
  const classes = ['stat-card'];
  if (className) classes.push(className);

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <div className="stat-card-icon">
        {typeof icon === 'string' ? <span aria-hidden>{icon}</span> : icon}
      </div>
    );
  };

  const renderSparkline = () => {
    if (!Array.isArray(sparkline) || sparkline.length < 2) return null;

    const normalized = sparkline.map((value) => {
      const safeValue = typeof value === 'number' ? value : 0;
      return Math.min(Math.max(safeValue, 0), 100);
    });

    const path = normalized
      .map((point, index) => {
        const x = (index / (normalized.length - 1)) * 100;
        const y = 40 - (point / 100) * 36;
        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');

    const areaPath = `${path} L100,40 L0,40 Z`;

    return (
      <div className="stat-card-sparkline" aria-hidden="true">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d={areaPath} className="stat-card-sparkline-area" />
          <path d={path} className="stat-card-sparkline-line" />
        </svg>
      </div>
    );
  };

  return (
    <div className={classes.join(' ')} {...props}>
      {renderIcon()}
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
      {trend !== undefined && (
        <div className={`stat-card-trend stat-card-trend--${trendDirection}`}>
          <span className="stat-card-trend-icon">
            {trendDirection === 'down' ? '-' : '+'}
          </span>
          {Math.abs(trend)}%
        </div>
      )}
      {renderSparkline()}
    </div>
  );
};

export default StatCard;
