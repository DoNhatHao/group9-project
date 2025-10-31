import React, { forwardRef, useId } from 'react';
import './Checkbox.css';

const Checkbox = forwardRef(({
  id,
  children,
  description,
  className = '',
  ...props
}, ref) => {
  const generatedId = useId();
  const checkboxId = id || `checkbox-${generatedId}`;
  const descriptionId = description ? `${checkboxId}-description` : undefined;

  const classes = ['ui-checkbox'];
  if (props.disabled) classes.push('ui-checkbox--disabled');
  if (className) classes.push(className);

  return (
    <label className={classes.join(' ')} htmlFor={checkboxId}>
      <input
        id={checkboxId}
        ref={ref}
        type="checkbox"
        className="ui-checkbox__input"
        aria-describedby={descriptionId}
        {...props}
      />
      <span className="ui-checkbox__control" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="ui-checkbox__icon">
          <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      </span>
      <span className="ui-checkbox__label">{children}</span>
      {description && (
        <span id={descriptionId} className="ui-checkbox__description">
          {description}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;



