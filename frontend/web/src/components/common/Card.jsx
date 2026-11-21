import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-iut-border shadow-sm overflow-hidden ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-base font-bold text-iut-blue">{title}</h2>
            )}
            {subtitle && (
              <p className="text-xs text-iut-text-grey mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
