import React from 'react';
import './Button.css';

const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  className = '',
  children,
  disabled: disabledProp = false,
  ...rest
}) => {
  const classes = ['ui-button', `ui-button--${variant}`, `ui-button--${size}`];
  if (block) {
    classes.push('ui-button--block');
  }
  if (loading) {
    classes.push('ui-button--loading');
  }
  if (className) {
    classes.push(className);
  }

  const isDisabled = disabledProp || loading;

  const componentProps = {
    className: classes.join(' '),
    'aria-busy': loading || undefined,
    ...rest
  };

  if (Component === 'button') {
    componentProps.disabled = isDisabled;
  } else if (isDisabled) {
    componentProps['aria-disabled'] = true;
    componentProps.tabIndex = -1;
  }

  return (
    <Component {...componentProps}>
      {loading && (
        <span className="ui-button__spinner" aria-hidden="true">
          <span className="ui-button__spinner-dot" />
          <span className="ui-button__spinner-dot" />
          <span className="ui-button__spinner-dot" />
        </span>
      )}
      <span className="ui-button__label">{children}</span>
    </Component>
  );
};

export default Button;


