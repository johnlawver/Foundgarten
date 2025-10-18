/**
 * ScoreDisplay Component
 * Displays current score and progress
 */

import React from 'react';

export interface ScoreDisplayProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  current,
  total,
  label = 'Score',
  showPercentage = false,
  size = 'medium',
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const sizeStyles = {
    small: 'text-sm px-3 py-1',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-5 py-3',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2
        bg-yellow-100 rounded-full border-[3px] border-black
        font-bold
        ${sizeStyles[size]}
      `}
    >
      <span className="text-black">{label}:</span>
      <span className="text-black">
        {current} / {total}
      </span>
      {showPercentage && total > 0 && (
        <span className="text-black text-sm">({percentage}%)</span>
      )}
    </div>
  );
};
