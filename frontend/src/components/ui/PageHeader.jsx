import React from 'react';
import './PageHeader.css';

const PageHeader = ({
  title,
  subtitle,
  breadcrumb,
  actions,
  children,
  className = ''
}) => {
  const classes = ['page-header'];
  if (className) classes.push(className);

  return (
    <header className={classes.join(' ')}>
      {breadcrumb && (
        <div className="page-header__breadcrumb" aria-label="Breadcrumb">
          {breadcrumb}
        </div>
      )}
      <div className="page-header__body">
        <div className="page-header__titles">
          <h1 className="page-header__title">{title}</h1>
          {subtitle && (
            <p className="page-header__subtitle">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="page-header__actions">
            {actions}
          </div>
        )}
      </div>
      {children && (
        <div className="page-header__footer">
          {children}
        </div>
      )}
    </header>
  );
};

export default PageHeader;



