import React from 'react';
import './PasswordStrength.css';

/**
 * PasswordStrength component - visual indicator for password strength
 * @param {string} password - Password to evaluate
 */
const PasswordStrength = ({ password }) => {
  // Calculate password strength
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 1, label: 'Yếu', color: 'weak' };
    if (score <= 3) return { level: 2, label: 'Trung bình', color: 'medium' };
    return { level: 3, label: 'Mạnh', color: 'strong' };
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bars">
        <div className={`password-strength-bar ${strength.level >= 1 ? `password-strength-bar--${strength.color}` : ''}`} />
        <div className={`password-strength-bar ${strength.level >= 2 ? `password-strength-bar--${strength.color}` : ''}`} />
        <div className={`password-strength-bar ${strength.level >= 3 ? `password-strength-bar--${strength.color}` : ''}`} />
      </div>
      <span className={`password-strength-label password-strength-label--${strength.color}`}>
        {strength.label}
      </span>
    </div>
  );
};

export default PasswordStrength;



