import React from 'react';
import './Skeleton.css';

const Skeleton = ({
  width = '100%',
  height = '1rem',
  rounded = 'var(--radius-sm)',
  className = '',
  style
}) => {
  const classes = ['ui-skeleton'];
  if (className) classes.push(className);

  return (
    <span
      className={classes.join(' ')}
      style={{
        width,
        height,
        borderRadius: rounded,
        ...style
      }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;



