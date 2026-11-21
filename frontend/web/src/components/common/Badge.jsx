import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-iut-orange-light text-iut-orange-dark border-iut-orange-border',
    info: 'bg-iut-blue-light text-iut-blue border-iut-blue-border',
    success: 'bg-iut-success-light text-iut-success border-green-200',
    danger: 'bg-iut-danger-light text-iut-danger border-red-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
