import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  title = 'Aucune donnée disponible',
  description = 'Aucun élément ne correspond aux filtres sélectionnés.',
  icon: Icon = Inbox,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg ${className}`}
    >
      <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-gray-100 text-iut-blue">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-iut-text-dark">{title}</h3>
      <p className="text-xs text-iut-text-grey max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
