import React, { forwardRef, useMemo, useState } from 'react';
import Input from './Input';
import './PasswordInput.css';

const PasswordInput = forwardRef(
  (
    {
      revealAriaLabel = 'Show password',
      hideAriaLabel = 'Hide password',
      onVisibilityChange,
      className = '',
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
      setVisible((previous) => {
        const nextValue = !previous;
        if (typeof onVisibilityChange === 'function') {
          onVisibilityChange(nextValue);
        }
        return nextValue;
      });
    };

    const toggleLabel = useMemo(() => (visible ? hideAriaLabel : revealAriaLabel), [
      visible,
      hideAriaLabel,
      revealAriaLabel,
    ]);

    const classes = ['password-input'];
    if (className) {
      classes.push(className);
    }

    return (
      <div className={classes.join(' ')}>
        <Input ref={ref} type={visible ? 'text' : 'password'} className="password-input__control" {...props} />
        <button
          type="button"
          className="password-input__toggle"
          onClick={toggleVisibility}
          aria-label={toggleLabel}
          aria-pressed={visible}
        >
          <span aria-hidden="true">{visible ? 'Hide' : 'Show'}</span>
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;


