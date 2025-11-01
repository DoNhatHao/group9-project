import React, { forwardRef } from 'react';
import './FeatureCard.css';

/**
 * FeatureCard component - displays feature with icon, title, and description
 * Used on landing page
 */
const FeatureCard = forwardRef(
  ({ icon, title, description, className = '', ...props }, ref) => {
    const classes = ['feature-card'];
    if (className) classes.push(className);

    return (
      <div ref={ref} className={classes.join(' ')} {...props}>
        <div className="feature-card-icon">{icon}</div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
      </div>
    );
  },
);

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;



