import React from 'react';

export const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner une option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = id || name;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-iut-text-dark uppercase tracking-wider"
        >
          {label} {required && <span className="text-iut-danger">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-3.5 py-2 bg-white border rounded text-sm text-iut-text-dark transition-colors duration-150 focus:outline-none focus:border-iut-orange focus:ring-2 focus:ring-iut-orange/20 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-iut-danger' : 'border-iut-border'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-iut-danger font-medium mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-iut-text-grey mt-0.5">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
