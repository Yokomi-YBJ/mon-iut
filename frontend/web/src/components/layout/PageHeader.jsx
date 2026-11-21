import React from 'react';

export const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && (
          <p className="text-sm text-iut-text-grey mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
