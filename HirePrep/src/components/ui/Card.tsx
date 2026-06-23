import React from 'react';

export const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface border border-border rounded-2xl shadow-xl shadow-black/40 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};
