import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ label = 'Chargement des données...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 text-iut-text-grey ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-iut-orange" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default Loader;
