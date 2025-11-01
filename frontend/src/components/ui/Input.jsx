import React from 'react';
import './Input.css';

/**
 * Input component with optional icon prefix and error states
 * Supports all native input props
 */
const Input = React.forwardRef(({
  type = 'text',
  icon,
  error,
  className = '',
  ...props
}, ref) => {
  const ariaInvalid = props['aria-invalid'];
  const invalid = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true';

  const classes = ['ui-input-wrapper'];
  if (invalid) classes.push('ui-input-wrapper--error');
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')}>
      {icon && <span className="ui-input-icon" aria-hidden="true">{icon}</span>}
      <input
        ref={ref}
        type={type}
        className={`ui-input ${icon ? 'ui-input--with-icon' : ''}`}
        {...props}
      />
      {error && <span className="ui-input-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

