import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick }) => (
  <div
    className={`glass-panel ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);
