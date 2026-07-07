import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;   // tailwind color class
  showShimmer?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress, color = 'from-ice-300 to-ice-200', showShimmer = true, className = '',
}) => (
  <div className={`glass-progress ${className}`}>
    <div
      className="glass-progress-fill"
      style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
    />
  </div>
);
