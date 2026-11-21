import React from 'react';
import EmptyState from './EmptyState';
import Loader from './Loader';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'Aucune ligne à afficher',
  keyExtractor = (row, i) => row.id || i,
  className = '',
}) => {
  if (isLoading) {
    return <Loader label="Chargement des lignes..." />;
  }

  if (!data || data.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className={`overflow-x-auto rounded border border-iut-border ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-iut-border">
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                scope="col"
                className={`py-3 px-4 font-bold text-xs uppercase tracking-wider text-iut-blue ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row, rowIndex)}
              className="hover:bg-slate-50/70 transition-colors duration-100"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key || colIndex}
                  className={`py-3 px-4 text-iut-text-dark ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
