import React from 'react';

export const Input = ({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-iut-text-dark uppercase tracking-wider"
        >
          {label} {required && <span className="text-iut-danger">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-3.5 py-2 bg-white border rounded text-sm text-iut-text-dark placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:border-iut-orange focus:ring-2 focus:ring-iut-orange/20 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-iut-danger focus:border-iut-danger focus:ring-iut-danger/20' : 'border-iut-border'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-iut-danger font-medium mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-iut-text-grey mt-0.5">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
