import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import './ErrorPage.css';

const NotFound = () => {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <div className="error-page__illustration">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="hsl(var(--primary-soft))" />
            <path
              d="M70 90 L70 110 M130 90 L130 110 M75 140 Q100 120 125 140"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="100"
              y="110"
              fontSize="72"
              fontWeight="700"
              fill="hsl(var(--primary))"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              404
            </text>
          </svg>
        </div>

        <div className="error-page__text">
          <h1 className="error-page__title">Page not found</h1>
          <p className="error-page__description">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
          </p>
        </div>

        <div className="error-page__actions">
          <Button as={Link} to="/" size="lg">
            Go to homepage
          </Button>
          <Button as={Link} to="/dashboard" variant="outline" size="lg">
            Go to dashboard
          </Button>
        </div>

        <div className="error-page__help">
          <p>Need help? <Link to="/profile" className="error-page__link">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

