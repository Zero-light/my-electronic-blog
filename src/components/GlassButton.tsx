import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'feed' | 'shop' | 'back';
  onClick?: () => void;
  className?: string;
}

const variantClass: Record<string, string> = {
  primary: 'glass-btn',
  feed: 'glass-btn glass-btn-feed',
  shop: 'glass-btn glass-btn-shop',
  back: 'glass-btn glass-btn-back',
};

export const GlassButton: React.FC<GlassButtonProps> = ({ children, variant = 'primary', onClick, className = '' }) => (
  <button
    className={`${variantClass[variant]} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);
