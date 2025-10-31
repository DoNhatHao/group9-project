import React, { forwardRef } from 'react';
import './Card.css';

/**
 * Card component - container with shadow and border
 * Supports elevated variant for increased shadow
 */
const Card = forwardRef(({ elevated = false, className = '', children, ...props }, ref) => {
  const classes = ['ui-card'];
  if (elevated) classes.push('ui-card--elevated');
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(' ')} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;



