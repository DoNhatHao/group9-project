import React from 'react';
import './Avatar.css';

/**
 * Avatar component - displays user avatar with fallback to initials
 * @param {string} src - Image URL
 * @param {string} name - User name for fallback initials
 * @param {string} size - Size variant: sm, md, lg, xl
 */
const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const classes = ['ui-avatar', `ui-avatar--${size}`];
  if (className) classes.push(className);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={classes.join(' ')} {...props}>
      {src ? (
        <img src={src} alt={name} className="ui-avatar-image" />
      ) : (
        <span className="ui-avatar-initials">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;



