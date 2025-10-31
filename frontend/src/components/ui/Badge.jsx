import React from 'react';
import './Badge.css';

const Badge = ({ variant = 'default', className = '', children }) => {
  const classes = ['ui-badge', `ui-badge--${variant}`];
  if (className) {
    classes.push(className);
  }

  return <span className={classes.join(' ')}>{children}</span>;
};

export default Badge;


