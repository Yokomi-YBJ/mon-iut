import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export const Alert = ({
  type = 'info',
  title,
  children,
  className = '',
  onClose,
}) => {
  const configs = {
    info: {
      bg: 'bg-iut-blue-light border-iut-blue-border text-iut-blue',
      icon: Info,
    },
    success: {
      bg: 'bg-iut-success-light border-green-200 text-iut-success',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-iut-orange-light border-iut-orange-border text-iut-orange-dark',
      icon: AlertCircle,
    },
    error: {
      bg: 'bg-iut-danger-light border-red-200 text-iut-danger',
      icon: XCircle,
    },
  };

  const config = configs[type] || configs.info;
  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 border rounded-lg text-sm ${config.bg} ${className}`}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h3 className="font-semibold">{title}</h3>}
        <div className="mt-0.5">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Fermer"
        >
          <span className="text-base font-bold leading-none">&times;</span>
        </button>
      )}
    </div>
  );
};

export default Alert;
